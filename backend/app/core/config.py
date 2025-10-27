"""
Core configuration settings
"""
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "OTG-TAK"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000"
    ]
    
    # Database
    DATABASE_URL: str = "sqlite:///./data/otg-tak.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    # Deployment
    ANSIBLE_PLAYBOOKS_DIR: str = "./ansible/playbooks"
    TERRAFORM_DIR: str = "./terraform"
    
    # TAK Server
    TAK_SERVER_DEFAULT_PORT: int = 8089
    
    # Tailscale
    TAILSCALE_AUTH_KEY: str = ""
    
    # Zerotier
    ZEROTIER_NETWORK_ID: str = ""
    ZEROTIER_API_TOKEN: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
