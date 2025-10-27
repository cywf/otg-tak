"""
File Converter API endpoints (KML/KMZ conversion)
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import zipfile
import os
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/kml-to-kmz")
async def convert_kml_to_kmz(file: UploadFile = File(...)):
    """
    Convert KML file to KMZ (zipped KML)
    """
    if not file.filename.endswith('.kml'):
        raise HTTPException(status_code=400, detail="File must be a KML file")
    
    # Create upload directory if it doesn't exist
    os.makedirs("data/uploads", exist_ok=True)
    
    # Save uploaded KML with sanitized filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    safe_name = f"{timestamp}_{uuid.uuid4()}_{os.path.basename(file.filename)}"
    kml_path = os.path.join("data/uploads", safe_name)
    
    with open(kml_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    # Create KMZ (ZIP with KML inside)
    kmz_filename = file.filename.replace('.kml', '.kmz')
    safe_kmz_name = f"{timestamp}_{uuid.uuid4()}_{os.path.basename(kmz_filename)}"
    kmz_path = os.path.join("data/uploads", safe_kmz_name)
    
    with zipfile.ZipFile(kmz_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(kml_path, arcname='doc.kml')
    
    # Clean up original KML
    os.remove(kml_path)
    
    return {
        "original_file": file.filename,
        "converted_file": kmz_filename,
        "download_path": kmz_path
    }

@router.post("/kmz-to-kml")
async def convert_kmz_to_kml(file: UploadFile = File(...)):
    """
    Convert KMZ file to KML (extract from zip)
    """
    if not file.filename.endswith('.kmz'):
        raise HTTPException(status_code=400, detail="File must be a KMZ file")
    
    # Create upload directory if it doesn't exist
    os.makedirs("data/uploads", exist_ok=True)
    
    # Save uploaded KMZ with sanitized filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    safe_name = f"{timestamp}_{uuid.uuid4()}_{os.path.basename(file.filename)}"
    kmz_path = os.path.join("data/uploads", safe_name)
    
    with open(kmz_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    # Extract KML from KMZ
    kml_filename = file.filename.replace('.kmz', '.kml')
    safe_kml_name = f"{timestamp}_{uuid.uuid4()}_{os.path.basename(kml_filename)}"
    kml_path = os.path.join("data/uploads", safe_kml_name)
    
    try:
        with zipfile.ZipFile(kmz_path, 'r') as zipf:
            # Look for KML file in the archive
            kml_files = [name for name in zipf.namelist() if name.endswith('.kml')]
            if not kml_files:
                raise HTTPException(status_code=400, detail="No KML file found in KMZ")
            
            # Extract first KML file
            kml_content = zipf.read(kml_files[0])
            with open(kml_path, 'wb') as f:
                f.write(kml_content)
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid KMZ file")
    finally:
        # Clean up KMZ
        os.remove(kmz_path)
    
    return {
        "original_file": file.filename,
        "converted_file": kml_filename,
        "download_path": kml_path
    }

@router.get("/download/{file_path}")
async def download_converted_file(file_path: str):
    """
    Download converted file
    """
    full_path = f"data/uploads/{file_path}"
    
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        full_path,
        media_type='application/octet-stream',
        filename=file_path
    )
