#!bin/sh

# Update the apt package index and install packages to allow apt to use a repository over HTTPS:
sudo apt-get update
sudo apt-get upgrade


# Install Docker
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker run hello-world

# Apply Docker Permissions
sudo systemctl stop docker
sudo mkdir /home/docker
sudo chown -R root:root /home/docker
sudo chmod -R 711 /home/docker

sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "data-root": "/home/docker"
}
EOF

sudo systemctl start docker

# Test Docker Permissions
docker info | grep "Docker Root Dir"


sudo chown -R 777 /home/docker/volumes

npm install
npm build
npm start