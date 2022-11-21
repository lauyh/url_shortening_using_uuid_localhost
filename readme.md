# Setup Guide
## Run Without Docker
1. Install Node JS on your machine, the detail of the installation can be found on https://nodejs.org/en/
2. Git clone this repo, open command prompt change the path to this repo and run `npm install && npm start`
3. To run the test, the command is `npm run test`

## Run With Docker
1. Install Docker from https://docs.docker.com/get-docker/
2. Start docker then open terminal change the direcotry to current project and run `docker build -t url_shortener && docker run -d -p 3000:3000 url_shortener`

# Evaluation
- In the beginning, I am thinking to use sqlite or lru cache to store the data. SQLite installation is tricky for Windows users, while cache is a key value pair storage with TTL (time to live). Hence either one of it is suitable to be used in the project. When I recall back, JavaScript has wonderful build in array function, then I jump from Golang to Express JS to kick start the project.
- Area of improvement, I will use the file system library and json file format to create a persistent data store. 
- Design an object data structure to keep track the count of the url and time of redirect of the url.
- Design an endpoint for admin to keep track the most popular url and the count of each. 
