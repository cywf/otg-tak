"""
QR Code Generator API endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import qrcode
from io import BytesIO
import base64
import json

router = APIRouter()

class QRCodeRequest(BaseModel):
    server_url: str
    server_port: int = 8089
    certificate_data: str
    username: str
    password: str

class QRCodeResponse(BaseModel):
    qr_code_base64: str
    config_json: str

@router.post("/generate", response_model=QRCodeResponse)
async def generate_qr_code(request: QRCodeRequest):
    """
    Generate QR code for ATAK/iTAK client onboarding
    """
    # Create configuration data
    config_data = {
        "type": "TAK_SERVER",
        "server": {
            "url": request.server_url,
            "port": request.server_port,
            "protocol": "ssl"
        },
        "auth": {
            "username": request.username,
            "password": request.password
        },
        "certificate": request.certificate_data
    }
    
    config_json = json.dumps(config_data)
    
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(config_json)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return QRCodeResponse(
        qr_code_base64=img_str,
        config_json=config_json
    )

@router.post("/batch-generate")
async def batch_generate_qr_codes(requests: list[QRCodeRequest]):
    """
    Generate multiple QR codes for batch client onboarding
    """
    results = []
    for req in requests:
        result = await generate_qr_code(req)
        results.append({
            "username": req.username,
            "qr_code": result.qr_code_base64
        })
    return results
