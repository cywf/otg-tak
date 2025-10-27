"""
OTG-TAK Backend API
On-The-Go TAK Deployment System
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api import (
    deployment,
    qr_generator,
    data_packages,
    routes,
    sdr,
    file_converter,
    server_status,
    poi_tracker,
    notepad
)
from app.core.config import settings
from app.core.database import init_db

app = FastAPI(
    title="OTG-TAK API",
    description="On-The-Go TAK Deployment System API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    await init_db()
    # Create necessary directories
    os.makedirs("data/qrcodes", exist_ok=True)
    os.makedirs("data/packages", exist_ok=True)
    os.makedirs("data/notes", exist_ok=True)
    os.makedirs("data/uploads", exist_ok=True)

# Include routers
app.include_router(deployment.router, prefix="/api/deployment", tags=["Deployment"])
app.include_router(qr_generator.router, prefix="/api/qr", tags=["QR Generator"])
app.include_router(data_packages.router, prefix="/api/packages", tags=["Data Packages"])
app.include_router(routes.router, prefix="/api/routes", tags=["Routes"])
app.include_router(sdr.router, prefix="/api/sdr", tags=["SDR"])
app.include_router(file_converter.router, prefix="/api/convert", tags=["File Converter"])
app.include_router(server_status.router, prefix="/api/status", tags=["Server Status"])
app.include_router(poi_tracker.router, prefix="/api/poi", tags=["POI Tracker"])
app.include_router(notepad.router, prefix="/api/notes", tags=["Notepad"])

# WebSocket for real-time updates
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast({"message": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
async def root():
    return {
        "message": "OTG-TAK API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
