resource "aws_key_pair" "ec2" {
  key_name   = "${var.project_name}-key"
  public_key = file("${path.module}/devops-dashboard.pem.pub")

  tags = {
    Name        = "${var.project_name}-key"
    Project     = var.project_name
    Environment = var.environment
  }
}