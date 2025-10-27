"""
Data Package Builder API endpoints
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import zipfile
import os
import json
from datetime import datetime

router = APIRouter()

class DataPackageRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    files: List[str]  # List of file paths
    metadata: Optional[dict] = {}

class DataPackageResponse(BaseModel):
    id: str
    name: str
    file_path: str
    created_at: str

@router.post("/create", response_model=DataPackageResponse)
async def create_data_package(package: DataPackageRequest):
    """
    Create a data package (ZIP file) containing specified files
    """
    package_id = f"pkg_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    package_dir = f"data/packages/{package_id}"
    os.makedirs(package_dir, exist_ok=True)
    
    zip_path = f"{package_dir}/{package.name}.zip"
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add metadata
        metadata = {
            "name": package.name,
            "description": package.description,
            "created_at": datetime.now().isoformat(),
            **package.metadata
        }
        zipf.writestr("manifest.json", json.dumps(metadata, indent=2))
        
        # Add files (in production, would copy actual files)
        for file_path in package.files:
            # Placeholder: would add actual files here
            zipf.writestr(f"data/{os.path.basename(file_path)}", f"Content of {file_path}")
    
    return DataPackageResponse(
        id=package_id,
        name=package.name,
        file_path=zip_path,
        created_at=datetime.now().isoformat()
    )

@router.post("/upload")
async def upload_package_file(file: UploadFile = File(...)):
    """
    Upload a file to be included in data packages
    """
    file_path = f"data/uploads/{file.filename}"
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    return {
        "filename": file.filename,
        "path": file_path,
        "size": len(content)
    }

@router.get("/list")
async def list_data_packages():
    """
    List all created data packages
    """
    packages = []
    packages_dir = "data/packages"
    
    if os.path.exists(packages_dir):
        for pkg_id in os.listdir(packages_dir):
            pkg_path = os.path.join(packages_dir, pkg_id)
            if os.path.isdir(pkg_path):
                for file in os.listdir(pkg_path):
                    if file.endswith('.zip'):
                        packages.append({
                            "id": pkg_id,
                            "name": file,
                            "path": os.path.join(pkg_path, file)
                        })
    
    return packages
