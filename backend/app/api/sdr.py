"""
SDR (Surveillance Detection Route) Builder API endpoints
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

router = APIRouter()

class SDRCheckpoint(BaseModel):
    name: str
    latitude: float
    longitude: float
    observation_type: str  # 'surveillance', 'observation', 'checkpoint'
    notes: Optional[str] = ""
    threat_level: Optional[str] = "low"  # low, medium, high

class SDRRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    checkpoints: List[SDRCheckpoint]
    area_of_interest: Optional[dict] = {}

class SDRResponse(BaseModel):
    id: str
    name: str
    file_path: str
    checkpoint_count: int

@router.post("/create", response_model=SDRResponse)
async def create_sdr(sdr: SDRRequest):
    """
    Create an SDR (Surveillance Detection Route)
    """
    sdr_id = f"sdr_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    sdr_path = f"data/packages/sdr/{sdr_id}.json"
    
    import os
    os.makedirs("data/packages/sdr", exist_ok=True)
    
    # Create SDR data structure
    sdr_data = {
        "id": sdr_id,
        "name": sdr.name,
        "description": sdr.description,
        "created_at": datetime.now().isoformat(),
        "area_of_interest": sdr.area_of_interest,
        "checkpoints": [cp.dict() for cp in sdr.checkpoints],
        "statistics": {
            "total_checkpoints": len(sdr.checkpoints),
            "high_threat": sum(1 for cp in sdr.checkpoints if cp.threat_level == "high"),
            "medium_threat": sum(1 for cp in sdr.checkpoints if cp.threat_level == "medium"),
            "low_threat": sum(1 for cp in sdr.checkpoints if cp.threat_level == "low")
        }
    }
    
    # Save to file
    with open(sdr_path, 'w') as f:
        json.dump(sdr_data, f, indent=2)
    
    return SDRResponse(
        id=sdr_id,
        name=sdr.name,
        file_path=sdr_path,
        checkpoint_count=len(sdr.checkpoints)
    )

@router.get("/list")
async def list_sdrs():
    """
    List all SDRs
    """
    sdrs = []
    sdr_dir = "data/packages/sdr"
    
    import os
    if os.path.exists(sdr_dir):
        for file in os.listdir(sdr_dir):
            if file.endswith('.json'):
                file_path = os.path.join(sdr_dir, file)
                with open(file_path, 'r') as f:
                    sdr_data = json.load(f)
                    sdrs.append({
                        "id": sdr_data["id"],
                        "name": sdr_data["name"],
                        "checkpoint_count": sdr_data["statistics"]["total_checkpoints"]
                    })
    
    return sdrs

@router.get("/{sdr_id}")
async def get_sdr(sdr_id: str):
    """
    Get SDR details
    """
    import os
    sdr_path = f"data/packages/sdr/{sdr_id}.json"
    
    if not os.path.exists(sdr_path):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="SDR not found")
    
    with open(sdr_path, 'r') as f:
        return json.load(f)
