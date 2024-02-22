# Social ecosystem analyser backend microservice

## Setup CI/CD
```bash
# Create ssh key and add it to folder ~/.ssh/authorized_keys
ssh-keygen -t rsa -b 4096 -f ~/.ssh/droplet_tfg
cat ~/.ssh/droplet_tfg.pub

ssh root@<ip> -i ~/.ssh/droplet_tfg
###
# Create a key to clone the repo from github and it to personal ssh-keys
ssh-keygen -t rsa -b 4096
cat ~/.ssh/id_rsa.pub

# Install dependencies

# Update the package index and upgrade packages
sudo apt update -y && sudo apt upgrade -y

# Install packages
sudo apt install -y curl git

# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update

# Install Docker related tools
sudo apt update -y
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose

# Add your user to the Docker group
sudo usermod -aG docker $USER

# Exit then ssh back in to pick up new permissions
exit
ssh ubuntu@<ip> -i ~/.ssh/droplet_tfg
```