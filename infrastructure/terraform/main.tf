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
  region = "us-east-1"
}

# Data source for existing hosted zone
data "aws_route53_zone" "main" {
  name = "inamulhaq.dev"
}

# Output the zone ID for reference
output "hosted_zone_id" {
  value = data.aws_route53_zone.main.zone_id
}