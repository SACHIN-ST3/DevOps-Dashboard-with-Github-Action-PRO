# DevOps Dashboard with GitHub Actions PRO

A complete DevOps learning project demonstrating Node.js, Express,
Docker, GitHub Actions CI/CD, GitHub Container Registry (GHCR),
Terraform, AWS VPC networking, Ubuntu EC2, SSH deployment, and health
checks.

The repository is designed so the AWS infrastructure can be destroyed
and rebuilt from the repository.

## 1. Architecture

``` text
Developer
   |
   | git push main
   v
GitHub
   |
   v
CI Pipeline
   |-- npm ci
   |-- npm test
   |-- Docker build
   `-- Push image to GHCR
   |
   | CI success
   v
CD Pipeline
   |-- SSH to EC2
   |-- docker pull <commit-sha>
   |-- stop/remove old container
   |-- run new container
   `-- health check
   |
   v
AWS EC2
   |
   v
Docker
   |
   v
Node.js + Express :8080
```

AWS infrastructure:

``` text
Internet
   |
Elastic IP
   |
Internet Gateway
   |
VPC 10.0.0.0/16
   |
Public Subnet 10.0.1.0/24
   |
Ubuntu 24.04 EC2
   |
Docker
   |
Application :8080
```

## 2. Repository Structure

``` text
DevOps-Dashboard-with-Github-Action-PRO/
|
+-- .github/
|   +-- workflows/
|       +-- ci.yml
|       +-- cd.yml
|
+-- public/
|   +-- index.html
|   +-- style.css
|   +-- script.js
|
+-- tests/
|   +-- health.test.js
|
+-- DevOps-Dashboard-AWS-INFRA-Terraform/
|   +-- provider.tf
|   +-- variables.tf
|   +-- terraform.tfvars.example
|   +-- vpc.tf
|   +-- subnet.tf
|   +-- internet-gateway.tf
|   +-- route-table.tf
|   +-- security-group.tf
|   +-- iam.tf
|   +-- key-pair.tf
|   +-- ec2.tf
|   +-- elastic-ip.tf
|   +-- user-data.sh
|   +-- outputs.tf
|   +-- generate-ssh-key.ps1
|   +-- terraform.lock.hcl
|
+-- Dockerfile
+-- docker-compose.yml
+-- index.js
+-- server.js
+-- package.json
+-- package-lock.json
+-- .dockerignore
+-- .gitignore
+-- README.md
```

## 3. Prerequisites

Windows/local requirements:

-   Git
-   PowerShell
-   OpenSSH client
-   Terraform
-   AWS CLI
-   AWS account
-   IAM identity allowed to create the project's AWS resources
-   GitHub account

Check installations:

``` powershell
git --version
ssh -V
terraform version
aws --version
node --version
npm --version
```

Node.js/npm are needed for local development. Docker on Windows is
optional because CI builds the production image.

## 4. Configure AWS CLI

Run:

``` powershell
aws configure
```

Use your AWS credentials and:

``` text
Default region: us-east-1
Output format: json
```

Verify:

``` powershell
aws sts get-caller-identity
```

This must succeed before Terraform is run.

Never commit AWS access keys, secret keys, tokens, or credentials.

## 5. Clone the Repository

``` powershell
git clone https://github.com/SACHIN-ST3/DevOps-Dashboard-with-Github-Action-PRO.git
cd DevOps-Dashboard-with-Github-Action-PRO
git status
```

## 6. Run the Application Locally

Install dependencies:

``` powershell
npm ci
```

Run tests:

``` powershell
npm test
```

Start:

``` powershell
npm start
```

Test:

``` powershell
curl.exe http://localhost:8080/api
curl.exe http://localhost:8080/api/health
curl.exe http://localhost:8080/api/info
curl.exe http://localhost:8080/api/message
```

Stop with `CTRL+C`.

## 7. Application Endpoints

``` text
GET /api
GET /api/health
GET /api/info
GET /api/message
```

Health response:

``` json
{
  "status": "UP",
  "message": "Application is healthy",
  "timestamp": "..."
}
```

Unknown routes return JSON HTTP 404.

## 8. Test Docker Locally

Build:

``` powershell
docker build -t devops-dashboard-pro .
```

Run:

``` powershell
docker run -d `
  --name devops-dashboard `
  -p 8080:8080 `
  --restart unless-stopped `
  devops-dashboard-pro
```

Check:

``` powershell
docker ps
curl.exe http://localhost:8080/api/health
```

Cleanup:

``` powershell
docker stop devops-dashboard
docker rm devops-dashboard
```

## 9. GitHub Container Registry

CI publishes:

``` text
ghcr.io/sachin-st3/devops-dashboard-pro
```

Tags:

``` text
latest
<git-commit-sha>
```

The CD pipeline deploys the commit-SHA tag, not `latest`, so the exact
image produced by CI is deployed.

## 10. Terraform AWS Infrastructure

Terraform directory:

``` text
DevOps-Dashboard-AWS-INFRA-Terraform/
```

Resources:

``` text
VPC
Internet Gateway
Public Subnet
Public Route Table
Route Table Association
Security Group
IAM Role
IAM Instance Profile
EC2 Key Pair
EC2 Instance
Elastic IP
Elastic IP Association
```

EC2 user-data installs:

``` text
docker.io
docker-compose-v2
curl
unzip
```

## 11. Configure Terraform Variables

Enter the Terraform directory:

``` powershell
cd DevOps-Dashboard-AWS-INFRA-Terraform
```

Create the local variables file:

``` powershell
Copy-Item terraform.tfvars.example terraform.tfvars
```

Edit:

``` powershell
notepad terraform.tfvars
```

Example:

``` hcl
aws_region          = "us-east-1"
project_name        = "devops-dashboard"
environment         = "dev"

vpc_cidr            = "10.0.0.0/16"
public_subnet_cidr  = "10.0.1.0/24"

availability_zone   = "us-east-1a"

instance_type       = "t3.micro"

ssh_allowed_cidr    = "YOUR_PUBLIC_IP/32"
```

Replace `YOUR_PUBLIC_IP` with your actual public IPv4 address.

Do not commit `terraform.tfvars`.

## 12. Generate the EC2 SSH Key

Run:

``` powershell
.\generate-ssh-key.ps1
```

Expected local files:

``` text
devops-dashboard.pem
devops-dashboard.pem.pub
```

The private `.pem` file must never be committed.

Terraform reads the public key to create the AWS EC2 key pair.

If rebuilding and you still have the old private key, you can reuse it.
If you generate a new key pair, use the new `.pem` for SSH and update
the GitHub `EC2_SSH_KEY` secret.

## 13. Terraform Initialization and Validation

Format:

``` powershell
terraform fmt -recursive
```

Initialize:

``` powershell
terraform init
```

Validate:

``` powershell
terraform validate
```

Plan:

``` powershell
terraform plan
```

Apply:

``` powershell
terraform apply
```

Review the plan before entering:

``` text
yes
```

Important: changing Terraform configuration normally does NOT require
`terraform destroy`. Use:

``` text
terraform plan
terraform apply
```

Terraform will update only the resources that need changing.

Use `terraform destroy` only when you intentionally want to remove the
infrastructure.

## 14. Terraform Outputs

After apply:

``` powershell
terraform output
```

Useful outputs:

``` powershell
terraform output -raw ec2_public_ip
terraform output -raw ec2_public_dns
terraform output -raw ssh_command
```

## 15. Connect to EC2

``` powershell
ssh -i .\devops-dashboard.pem ubuntu@YOUR_ELASTIC_IP
```

Ubuntu uses:

``` text
ubuntu
```

as the SSH user.

## 16. Verify EC2

Inside EC2:

``` bash
whoami
cat /etc/os-release
docker --version
sudo systemctl is-active docker
docker ps
```

Docker should be active.

If Docker is not installed or user-data failed:

``` bash
sudo cat /var/log/devops-dashboard-user-data.log
sudo systemctl status docker
```

## 17. Manually Deploy the GHCR Image First

Before depending on CD, prove that EC2 can run the image.

Because the GHCR package is public:

``` bash
docker pull ghcr.io/sachin-st3/devops-dashboard-pro:latest
```

Run:

``` bash
docker run -d   --name devops-dashboard   -p 8080:8080   --restart unless-stopped   ghcr.io/sachin-st3/devops-dashboard-pro:latest
```

Check:

``` bash
docker ps
curl http://localhost:8080/api/health
```

From Windows:

``` powershell
curl.exe http://YOUR_ELASTIC_IP:8080/api/health
```

## 18. GitHub Actions CI

File:

``` text
.github/workflows/ci.yml
```

CI performs:

``` text
Checkout
   |
Node.js 22
   |
npm ci
   |
npm test
   |
Docker build
   |
GHCR login
   |
Docker push
```

CI must succeed before CD is allowed to deploy.

## 19. GitHub Actions CD

File:

``` text
.github/workflows/cd.yml
```

CD is intentionally a separate workflow.

It waits for the CI workflow to complete successfully on a push to
`main`.

Deployment:

``` text
CI SUCCESS
    |
    v
SSH -> EC2
    |
    v
docker pull <commit-sha>
    |
    v
stop old container
    |
    v
remove old container
    |
    v
run new container
    |
    v
/api/health
```

## 20. GitHub Actions Secrets

Repository:

``` text
Settings
  -> Secrets and variables
     -> Actions
```

Create:

``` text
EC2_HOST
EC2_USER
EC2_SSH_KEY
```

Values:

``` text
EC2_HOST = Elastic IP of EC2
EC2_USER = ubuntu
EC2_SSH_KEY = complete contents of devops-dashboard.pem
```

Never put the private key in the repository.

## 21. SSH Security Note

The SSH-based CD workflow runs from a GitHub-hosted runner.

If the EC2 Security Group allows SSH only from your personal IP, the
GitHub runner will normally be blocked.

For this learning project, TCP 22 may temporarily be opened to:

``` text
0.0.0.0/0
```

This is NOT recommended for production.

A production design should use AWS Systems Manager and GitHub OIDC,
avoiding a publicly exposed SSH deployment path.

## 22. Test CI/CD

Make a small application change.

Then:

``` powershell
git add .
git commit -m "test: trigger CI and CD"
git push origin main
```

GitHub Actions should show:

``` text
DevOps Dashboard PRO - CI
        |
        | SUCCESS
        v
DevOps Dashboard PRO - CD
        |
        v
Deployment SUCCESS
```

## 23. Verify the Deployment

SSH:

``` powershell
ssh -i .\devops-dashboard.pem ubuntu@YOUR_ELASTIC_IP
```

Check:

``` bash
docker ps
```

Check deployed image:

``` bash
docker inspect devops-dashboard   --format '{{.Config.Image}}'
```

It should contain:

``` text
ghcr.io/sachin-st3/devops-dashboard-pro:<commit-sha>
```

Health:

``` bash
curl http://localhost:8080/api/health
```

From Windows:

``` powershell
curl.exe http://YOUR_ELASTIC_IP:8080/api/health
```

## 24. Normal Daily Development

Once everything is configured, application development is simple:

``` powershell
git add .
git commit -m "feat: update dashboard"
git push origin main
```

Then:

``` text
GitHub
   |
   v
CI
   |-- test
   |-- build
   `-- push GHCR
   |
   | success
   v
CD
   |-- SSH
   |-- pull
   |-- replace container
   `-- health check
   |
   v
EC2 application updated
```

Do not run Terraform for ordinary application code changes.

Run Terraform when infrastructure changes.

## 25. When to Use Terraform

Examples:

``` text
Change EC2 instance type
Change VPC
Change subnet
Change CIDR
Change security group
Add IAM resource
Add AWS resource
Change Elastic IP configuration
Change infrastructure user-data
```

Then:

``` powershell
terraform plan
terraform apply
```

## 26. Destroy the AWS Infrastructure

Only do this when you intentionally want to remove the AWS resources:

``` powershell
terraform destroy
```

Confirm:

``` text
yes
```

This removes the infrastructure managed by this Terraform configuration.

## 27. Complete Clean Rebuild

From a new machine or after destroying the AWS infrastructure:

``` powershell
git clone https://github.com/SACHIN-ST3/DevOps-Dashboard-with-Github-Action-PRO.git
cd DevOps-Dashboard-with-Github-Action-PRO
cd DevOps-Dashboard-AWS-INFRA-Terraform
```

Generate key:

``` powershell
.\generate-ssh-key.ps1
```

Create variables:

``` powershell
Copy-Item terraform.tfvars.example terraform.tfvars
notepad terraform.tfvars
```

Configure:

``` hcl
ssh_allowed_cidr = "YOUR_PUBLIC_IP/32"
```

Verify AWS:

``` powershell
aws sts get-caller-identity
```

Initialize:

``` powershell
terraform init
```

Validate:

``` powershell
terraform validate
```

Plan:

``` powershell
terraform plan
```

Apply:

``` powershell
terraform apply
```

Get the new IP:

``` powershell
terraform output -raw ec2_public_ip
```

Connect:

``` powershell
ssh -i .\devops-dashboard.pem ubuntu@YOUR_ELASTIC_IP
```

Then verify Docker and deploy through CI/CD.

## 28. Important Rebuild Issue: Elastic IP

If you destroy the Elastic IP and later create a new one, the EC2 public
IP can change.

Update the GitHub secret:

``` text
EC2_HOST
```

with the new Elastic IP.

If you generated a new SSH key, also update:

``` text
EC2_SSH_KEY
```

The GitHub repository files themselves do not contain these secrets.

## 29. Files That Must NOT Be Committed

Never commit:

``` text
terraform.tfvars
terraform.tfstate
terraform.tfstate.*
.terraform/
*.pem
*.key
.env
AWS access keys
AWS secret keys
GitHub tokens
SSH private keys
API tokens
passwords
```

The repository should contain:

``` text
terraform.tfvars.example
terraform.lock.hcl
*.tf
user-data.sh
generate-ssh-key.ps1
```

`terraform.lock.hcl` should be committed.

## 30. Terraform State

Terraform normally creates:

``` text
terraform.tfstate
```

This contains infrastructure state and can contain sensitive
information.

Do not commit it.

For this learning project, local state is acceptable.

For a production project, use a remote Terraform backend such as S3 with
appropriate state locking and access controls.

## 31. Useful Terraform Commands

``` powershell
terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
terraform output
terraform state list
terraform state show aws_instance.app
terraform destroy
```

## 32. Useful Docker Commands

``` bash
docker ps
docker ps -a
docker images
docker logs devops-dashboard
docker logs -f devops-dashboard
docker stop devops-dashboard
docker rm devops-dashboard
docker pull IMAGE
```

## 33. Troubleshooting

### AWS authentication

``` powershell
aws sts get-caller-identity
```

If this fails, fix AWS authentication before Terraform.

### Terraform public-key error

``` powershell
Get-ChildItem *.pem*
```

You should have the key pair generated by:

``` powershell
.\generate-ssh-key.ps1
```

### SSH failure

Verify:

``` text
username = ubuntu
Elastic IP is correct
private key matches the public key used by Terraform
Security Group permits TCP 22
```

Command:

``` powershell
ssh -i .\devops-dashboard.pem ubuntu@YOUR_ELASTIC_IP
```

### Docker failure

``` bash
sudo systemctl status docker
sudo cat /var/log/devops-dashboard-user-data.log
```

### Container failure

``` bash
docker ps -a
docker logs devops-dashboard
```

### Application failure

``` bash
curl http://localhost:8080/api/health
```

If localhost works but the public IP does not, check the Security Group
and network path.

### CD SSH failure

Check:

``` text
EC2_HOST
EC2_USER
EC2_SSH_KEY
EC2 is running
Security Group TCP 22
new Elastic IP
```

### Wrong Docker image

``` bash
docker inspect devops-dashboard   --format '{{.Config.Image}}'
```

The expected deployment image contains the commit SHA.

## 34. Security Checklist

Before production:

``` text
[ ] Never commit .pem
[ ] Never commit AWS credentials
[ ] Never commit terraform.tfvars
[ ] Never commit terraform.tfstate
[ ] Restrict SSH
[ ] Prefer AWS SSM for automated access
[ ] Use GitHub OIDC for AWS
[ ] Use HTTPS
[ ] Prefer private EC2 networking
[ ] Scan Docker images
[ ] Scan Terraform
[ ] Add monitoring
[ ] Add rollback
[ ] Use remote Terraform state
```

## 35. Production Improvements

This project intentionally uses a simple architecture for learning.

Future improvements:

``` text
AWS SSM instead of SSH
GitHub OIDC
HTTPS/TLS
Application Load Balancer
Private EC2 subnet
NAT Gateway
Auto Scaling
Remote Terraform state
S3 backend
State locking
Docker HEALTHCHECK
Automatic rollback
Blue/green deployment
Canary deployment
CloudWatch monitoring
Prometheus/Grafana
Trivy scanning
SonarQube/SonarCloud
Dependabot
Terraform security scanning
```

## 36. Final Rebuild Checklist

``` powershell
git clone https://github.com/SACHIN-ST3/DevOps-Dashboard-with-Github-Action-PRO.git

cd DevOps-Dashboard-with-Github-Action-PRO

cd DevOps-Dashboard-AWS-INFRA-Terraform

.\generate-ssh-key.ps1

Copy-Item terraform.tfvars.example terraform.tfvars

notepad terraform.tfvars

aws sts get-caller-identity

terraform init

terraform fmt -recursive

terraform validate

terraform plan

terraform apply

terraform output

terraform output -raw ec2_public_ip
```

Then:

``` powershell
ssh -i .\devops-dashboard.pem ubuntu@YOUR_ELASTIC_IP
```

Verify:

``` bash
docker --version
docker ps
```

Finally push an application change:

``` powershell
git add .
git commit -m "feat: deploy application"
git push origin main
```

CI builds and publishes the image. CD deploys the exact CI image to EC2.

## 37. Responsibility of Each Tool

``` text
Terraform
    = AWS infrastructure

Git
    = source control

GitHub
    = source repository

GitHub Actions CI
    = test + build + package

GHCR
    = container registry

GitHub Actions CD
    = deployment automation

Docker
    = container runtime

EC2
    = compute server

Ubuntu
    = operating system

Node.js + Express
    = application
```

## 38. End-to-End DevOps Lifecycle

``` text
PLAN
  |
  v
CODE
  |
  v
GIT
  |
  v
CI
  |-- npm ci
  |-- npm test
  |-- Docker build
  `-- GHCR
  |
  v
CD
  |-- EC2
  |-- Docker pull
  |-- Container replacement
  `-- Health check
  |
  v
RUNNING APPLICATION
```

The project demonstrates a complete beginner-to-intermediate DevOps
workflow while keeping infrastructure and application responsibilities
separated.
