Client: 
  yarn server
Server:
  nodemon server.js
Docker:
  docker stop $(docker ps -q)
  docker rm -f $(docker ps -a -q)


1. Check you ubuntu version with bash command. Check your ubuntu is noble or jammy.
lsb_release -a

2. Remove old docker packages.
sudo apt-get remove -y docker docker-engine docker.io containerd runc || true

3. Install prerequisites and Docker signing key:

sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update

4. Install docker 27.3.1. check your Ubuntu version and codename and replace.

sudo apt-get install -y \
  docker-ce=5:27.3.1-1~ubuntu.24.04~noble \
  docker-ce-cli=5:27.3.1-1~ubuntu.24.04~noble \
  containerd.io docker-compose-plugin

5. download base image

docker pull kasmweb/core-ubuntu-jammy:develop

6. run build.sh


pm2 start yarn --name "user_front" -- start