"""
Route Package Builder API endpoints
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json
import xml.etree.ElementTree as ET

router = APIRouter()

class Waypoint(BaseModel):
    name: str
    latitude: float
    longitude: float
    elevation: Optional[float] = 0.0
    description: Optional[str] = ""

class RouteRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    waypoints: List[Waypoint]
    route_type: str = "navigation"  # navigation, patrol, etc.

class RouteResponse(BaseModel):
    id: str
    name: str
    file_path: str
    format: str

@router.post("/create", response_model=RouteResponse)
async def create_route_package(route: RouteRequest):
    """
    Create a route package in KML format
    """
    route_id = f"route_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    route_path = f"data/packages/routes/{route_id}.kml"
    
    # Create routes directory if it doesn't exist
    import os
    os.makedirs("data/packages/routes", exist_ok=True)
    
    # Generate KML
    kml = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
    document = ET.SubElement(kml, 'Document')
    
    name_elem = ET.SubElement(document, 'name')
    name_elem.text = route.name
    
    desc_elem = ET.SubElement(document, 'description')
    desc_elem.text = route.description
    
    # Create placemark for the route
    placemark = ET.SubElement(document, 'Placemark')
    pm_name = ET.SubElement(placemark, 'name')
    pm_name.text = route.name
    
    # LineString for the route
    linestring = ET.SubElement(placemark, 'LineString')
    coordinates = ET.SubElement(linestring, 'coordinates')
    
    coords_text = []
    for wp in route.waypoints:
        coords_text.append(f"{wp.longitude},{wp.latitude},{wp.elevation}")
    coordinates.text = "\n".join(coords_text)
    
    # Add waypoint placemarks
    for wp in route.waypoints:
        wp_placemark = ET.SubElement(document, 'Placemark')
        wp_name = ET.SubElement(wp_placemark, 'name')
        wp_name.text = wp.name
        
        if wp.description:
            wp_desc = ET.SubElement(wp_placemark, 'description')
            wp_desc.text = wp.description
        
        point = ET.SubElement(wp_placemark, 'Point')
        wp_coords = ET.SubElement(point, 'coordinates')
        wp_coords.text = f"{wp.longitude},{wp.latitude},{wp.elevation}"
    
    # Write KML file
    tree = ET.ElementTree(kml)
    tree.write(route_path, encoding='utf-8', xml_declaration=True)
    
    return RouteResponse(
        id=route_id,
        name=route.name,
        file_path=route_path,
        format="kml"
    )

@router.get("/list")
async def list_routes():
    """
    List all created routes
    """
    routes = []
    routes_dir = "data/packages/routes"
    
    import os
    if os.path.exists(routes_dir):
        for file in os.listdir(routes_dir):
            if file.endswith('.kml'):
                routes.append({
                    "id": file.replace('.kml', ''),
                    "name": file,
                    "path": os.path.join(routes_dir, file)
                })
    
    return routes
