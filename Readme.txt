Client: 
  yarn server
Server:
  nodemon server.js
Docker:
  docker stop $(docker ps -q)
  docker rm -f $(docker ps -a -q)