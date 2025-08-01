# AWS App Runner Service
resource "aws_apprunner_service" "mistle" {
  service_name = "mistle-app"

  source_configuration {
    image_repository {
      image_configuration {
        port = "3000"
        runtime_environment_variables = {
          NODE_ENV = "production"
        }
        runtime_environment_secrets = {
          NEXTAUTH_URL = aws_ssm_parameter.nextauth_url.arn
          NEXTAUTH_SECRET = aws_ssm_parameter.nextauth_secret.arn
          MONGO_URL = aws_ssm_parameter.mongo_url.arn
        }
      }
      image_identifier      = "inam101001/mistle-app:latest"
      image_repository_type = "ECR_PUBLIC"
    }
    auto_deployments_enabled = true
  }

  health_check_configuration {
    healthy_threshold   = 1
    interval            = 10
    path                = "/"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 5
  }

  instance_configuration {
    cpu    = "0.25 vCPU"
    memory = "0.5 GB"
  }

  tags = {
    Project = "Mistle"
    Environment = "production"
  }
}

# Store secrets in AWS Systems Manager Parameter Store
resource "aws_ssm_parameter" "nextauth_url" {
  name  = "/mistle/nextauth-url"
  type  = "String"
  value = "https://mistle.inamulhaq.dev"
}

resource "aws_ssm_parameter" "nextauth_secret" {
  name  = "/mistle/nextauth-secret"
  type  = "SecureString"
  value = "mistle-production-secret-change-this"
}

resource "aws_ssm_parameter" "mongo_url" {
  name  = "/mistle/mongo-url"
  type  = "SecureString"
  value = "mongodb+srv://mistlediagrams:20014119-000@mistle.q1zv5bw.mongodb.net/mistle-app?retryWrites=true&w=majority"
}

# Output the App Runner service URL
output "app_runner_service_url" {
  value = aws_apprunner_service.mistle.service_url
}
