# Terraform Variables

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "otg-tak"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "tak_instance_type" {
  description = "EC2 instance type for TAK server"
  type        = string
  default     = "t3.large"
}

variable "ssh_key_name" {
  description = "SSH key name for EC2 instances"
  type        = string
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks allowed to SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_tak_cidrs" {
  description = "CIDR blocks allowed to access TAK server"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
