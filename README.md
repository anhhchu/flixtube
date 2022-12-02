## Work with npm

`node --version`: Checks that Node.js is installed; prints the version number.

`npm init -y`: Creates a default Node.js project with a stub for our package.json, the file that tracks metadata and dependencies for our Node.js project.

`npm install --save <package-name>`: Installs an npm package. There are many other packages available on npm, and you can install any by inserting a specific package name.

`npm install`: Installs all dependencies for a Node.js project. This also installs all the packages that have been previously recorded in package.json.

`node <script-file>`: Runs a Node.js script file. We invoke the node command and give it the name of our script file as an argument. You can call your script main.js or server.js if you want, but it’s probably best to stick to the convention and just call it index.js.

`npm start`: The conventional npm script for starting a Node.js application regardless of what name the main script file has or what command-line parameters it expects.Typically this translates into node index.js in the package.json file, but it depends on the author of the project and how they have set it up. The nice thing is that no matter how a particular project is structured, you only have to remember npm start.

`npm run start:dev`: My personal convention for starting a Node.js project in development. I add this to the scripts in package.json. Typically, it runs something like nodemon to enable live reload of your code as you work on it.

### 1. For dev environment

Install dependencies: `npm install`

Run the project: `node index.js`

Run testing: `npm test`

#### 1.1. Set up live reload

`npm install --save-dev nodemon`

* save-dev: install package as dev dependency
* nodemon: use for live reload

`npx nodemon index.js`: run installed dependencies from the command line in the current project, not globally. Use the right versions of modules and stops our system from getting cluttered up by globally installed modules

`npm run start:dev`: start the app in dev env after adding `start:dev` to package.json


### 2. For prod environment

Install dependencies only for production env: `npm install --only=production`

When we run npm install `--only=production`, then the packages we install to help with development, like nodemon, will be excluded.

Run the project in production mode: `npm start` after add `start` to package.json


## Work with Docker

### 1. Docker image

#### 1.1. Build Docker Images

    docker build -t video-streaming --file Dockerfile .

    docker build -t <your-name-for-the-image> --file <path-to-your-Dockerfile>  <path-to-project>

* *The -t argument allows us to tag or name our image*
* *The --file argument specifies the name of the Dockerfile to use.*
* *The dot `.`*: It tells the build command to operate against the current directory.

#### 1.2. Publish Docker Image to Cloud Registry

* Create Container Registry on Azure

* authenticate with `docker login`

      docker login <cr url> --username <user> --password <password>

* publish `docker push`

        docker tag <existing-image> <registry-url>/<image-name-registry>:<version>

        docker push <registry-url>/<image-name-registry>:<version>

* test with `docker run`

#### 1.3. Remove Docker Image

    docker rmi <your-image-id> --force

* Use --force to remove all tagged versions of an image these are all removed.

### 2. Docker Container

Instantiate docker image as a container to run the app

    docker run -d -p 3000:3000 video-streaming

    docker run -d -p <host-port>:<container-port> <image-name>

Run from image in registry

    docker run -d -p 3000:3000 anhcr.azurecr.io/video-streaming:latest

    docker run -d -p <host-port>:<container-port> <registry-url>/<image-name>:<version>

* -d: run in detached mode
* -p: bind container port to host port. network traffic sent to port 3000 on our development workstation is forwarded to port 3000 inside our container

List container 

    docker container list

Logs 

    docker logs <container-id>

Run public images

    docker run -p 27017:27017 mongo:latest

Check and kill running containers

    docker ps
    docker kill <container-id> 
    docker rm <container-id>

### 3. Docker Compose

https://docs.docker.com/compose/compose-file/compose-file-v3/

Docker Compose allows us to configure, build, run, and manage multiple containers at the same time.

    docker-compose --version

Invoke docker-compose file to build and launch application

    docker-compose up --build

The `up` command causes Docker Compose to boot our microservices application. The `--build` argument makes Docker Compose build each of our images before instantiating containers from these 

Stop docker container

    docker-compose stop

Remove docker container

    docker-compose down

### 4. Add sercret using Docker Swarm Stack

https://www.rockyourcode.com/using-docker-secrets-with-docker-compose/

    docker swarm init

    printf "anhtestvideos" | docker secret create storage_account_name - 

    docker secret inspect storage_account_name 



## Work with Database and Storage

### 1. Install `mongodb` in video-streaming microservice
    
    npm install --save mongodb

### 2. Run docker-compose to start all services

### 3. connect to mongodb on host:4000
create video-streaming db, videos collection
add video-record

### 4. check video-streaming localhost

    http://localhost:4002/video?id=5d9e690ad76fe06a3d7ae416
















