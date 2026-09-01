output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "Public subnet ID"
  value       = aws_subnet.public.id
}

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.app.id
}

output "ec2_public_ip" {
  description = "Elastic IP assigned to EC2"
  value       = aws_eip.app.public_ip
}

output "ec2_public_dns" {
  description = "EC2 public DNS"
  value       = aws_instance.app.public_dns
}

output "ec2_private_ip" {
  description = "EC2 private IP"
  value       = aws_instance.app.private_ip
}

output "security_group_id" {
  description = "Security Group ID"
  value       = aws_security_group.ec2.id
}

output "ssh_command" {
  description = "SSH command for connecting to EC2"
  value       = "ssh -i ./devops-dashboard.pem ubuntu@${aws_eip.app.public_ip}"
}