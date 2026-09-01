$KeyName = "devops-dashboard"

$PrivateKey = Join-Path $PSScriptRoot "$KeyName.pem"
$PublicKey  = "$PrivateKey.pub"

if (Test-Path $PrivateKey) {
    Write-Host "Private key already exists:"
    Write-Host $PrivateKey
    exit 0
}

Write-Host "Generating SSH key pair..."

ssh-keygen `
    -t rsa `
    -b 4096 `
    -m PEM `
    -f $PrivateKey `
    -N ""

if ($LASTEXITCODE -ne 0) {
    Write-Error "SSH key generation failed."
    exit 1
}

Write-Host ""
Write-Host "SSH key pair created successfully."
Write-Host ""
Write-Host "Private key:"
Write-Host $PrivateKey
Write-Host ""
Write-Host "Public key:"
Write-Host $PublicKey