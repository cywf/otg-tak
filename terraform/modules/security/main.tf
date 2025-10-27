# Security Module - Additional security configurations

# WAF Web ACL (optional, for HTTPS endpoints)
resource "aws_wafv2_web_acl" "tak" {
  name  = "${var.project_name}-waf"
  scope = "REGIONAL"
  
  default_action {
    allow {}
  }
  
  # Rate limiting rule
  rule {
    name     = "RateLimitRule"
    priority = 1
    
    action {
      block {}
    }
    
    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRule"
      sampled_requests_enabled   = true
    }
  }
  
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project_name}-waf"
    sampled_requests_enabled   = true
  }
  
  tags = {
    Name        = "${var.project_name}-waf"
    Environment = var.environment
  }
}

# CloudWatch Log Group for security monitoring
resource "aws_cloudwatch_log_group" "security" {
  name              = "/aws/${var.project_name}/security"
  retention_in_days = 30
  
  tags = {
    Name        = "${var.project_name}-security-logs"
    Environment = var.environment
  }
}

# Variables
variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}
