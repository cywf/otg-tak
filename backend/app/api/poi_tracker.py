"""
POI (Person of Interest) Tracker API endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import POI

router = APIRouter()

class POIRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    category: Optional[str] = "general"
    latitude: Optional[str] = ""
    longitude: Optional[str] = ""
    metadata: Optional[dict] = {}

class POIResponse(BaseModel):
    id: int
    name: str
    description: str
    category: str
    latitude: str
    longitude: str
    metadata: dict
    created_at: str
    updated_at: Optional[str] = None

@router.post("/create", response_model=POIResponse)
async def create_poi(poi: POIRequest, db: AsyncSession = Depends(get_db)):
    """
    Create a new POI
    """
    new_poi = POI(
        name=poi.name,
        description=poi.description,
        category=poi.category,
        latitude=poi.latitude,
        longitude=poi.longitude,
        metadata=poi.metadata
    )
    
    db.add(new_poi)
    await db.commit()
    await db.refresh(new_poi)
    
    return POIResponse(
        id=new_poi.id,
        name=new_poi.name,
        description=new_poi.description or "",
        category=new_poi.category or "general",
        latitude=new_poi.latitude or "",
        longitude=new_poi.longitude or "",
        metadata=new_poi.metadata or {},
        created_at=new_poi.created_at.isoformat(),
        updated_at=new_poi.updated_at.isoformat() if new_poi.updated_at else None
    )

@router.get("/list")
async def list_pois(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    List all POIs, optionally filtered by category
    """
    query = select(POI)
    if category:
        query = query.where(POI.category == category)
    
    result = await db.execute(query)
    pois = result.scalars().all()
    
    return [
        POIResponse(
            id=p.id,
            name=p.name,
            description=p.description or "",
            category=p.category or "general",
            latitude=p.latitude or "",
            longitude=p.longitude or "",
            metadata=p.metadata or {},
            created_at=p.created_at.isoformat(),
            updated_at=p.updated_at.isoformat() if p.updated_at else None
        )
        for p in pois
    ]

@router.get("/{poi_id}", response_model=POIResponse)
async def get_poi(poi_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get POI details
    """
    result = await db.execute(select(POI).where(POI.id == poi_id))
    poi = result.scalar_one_or_none()
    
    if not poi:
        raise HTTPException(status_code=404, detail="POI not found")
    
    return POIResponse(
        id=poi.id,
        name=poi.name,
        description=poi.description or "",
        category=poi.category or "general",
        latitude=poi.latitude or "",
        longitude=poi.longitude or "",
        metadata=poi.metadata or {},
        created_at=poi.created_at.isoformat(),
        updated_at=poi.updated_at.isoformat() if poi.updated_at else None
    )

@router.put("/{poi_id}", response_model=POIResponse)
async def update_poi(
    poi_id: int,
    poi_update: POIRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Update POI
    """
    result = await db.execute(select(POI).where(POI.id == poi_id))
    poi = result.scalar_one_or_none()
    
    if not poi:
        raise HTTPException(status_code=404, detail="POI not found")
    
    poi.name = poi_update.name
    poi.description = poi_update.description
    poi.category = poi_update.category
    poi.latitude = poi_update.latitude
    poi.longitude = poi_update.longitude
    poi.metadata = poi_update.metadata
    
    await db.commit()
    await db.refresh(poi)
    
    return POIResponse(
        id=poi.id,
        name=poi.name,
        description=poi.description or "",
        category=poi.category or "general",
        latitude=poi.latitude or "",
        longitude=poi.longitude or "",
        metadata=poi.metadata or {},
        created_at=poi.created_at.isoformat(),
        updated_at=poi.updated_at.isoformat() if poi.updated_at else None
    )

@router.delete("/{poi_id}")
async def delete_poi(poi_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete POI
    """
    result = await db.execute(select(POI).where(POI.id == poi_id))
    poi = result.scalar_one_or_none()
    
    if not poi:
        raise HTTPException(status_code=404, detail="POI not found")
    
    await db.delete(poi)
    await db.commit()
    
    return {"message": "POI deleted successfully"}
