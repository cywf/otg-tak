# Main Terraform Configuration for OTG-TAK Cloud Deployment

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Module
module "vpc" {
  source = "./modules/networking"
  
  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
}

# TAK Server Module
module "tak_server" {
  source = "./modules/tak-server"
  
  project_name    = var.project_name
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  instance_type   = var.tak_instance_type
  key_name        = var.ssh_key_name
}

# Security Module
module "security" {
  source = "./modules/security"
  
  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
}

# Outputs
output "tak_server_public_ip" {
  value       = module.tak_server.public_ip
  description = "Public IP address of TAK server"
}

output "tak_server_private_ip" {
  value       = module.tak_server.private_ip
  description = "Private IP address of TAK server"
}

output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "VPC ID"
}
