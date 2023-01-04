# npm

`node --version`: Checks that Node.js is installed; prints the version number.

`npm init -y`: Creates a default Node.js project with a stub for our package.json, the file that tracks metadata and dependencies for our Node.js project.

`npm install --save <package-name>`: Installs an npm package. There are many other packages available on npm, and you can install any by inserting a specific package name.

`npm install`: Installs all dependencies for a Node.js project. This also installs all the packages that have been previously recorded in package.json.

`node <script-file>`: Runs a Node.js script file. We invoke the node command and give it the name of our script file as an argument. You can call your script main.js or server.js if you want, but it’s probably best to stick to the convention and just call it index.js.

`npm start`: The conventional npm script for starting a Node.js application regardless of what name the main script file has or what command-line parameters it expects.Typically this translates into node index.js in the package.json file, but it depends on the author of the project and how they have set it up. The nice thing is that no matter how a particular project is structured, you only have to remember npm start.

`npm run start:dev`: My personal convention for starting a Node.js project in development. I add this to the scripts in package.json. Typically, it runs something like nodemon to enable live reload of your code as you work on it.

## 1. For dev environment

Install dependencies: `npm install`

Run the project: `node index.js`

Run testing: `npm test`

## 1.1. Set up live reload

`npm install --save-dev nodemon`

* save-dev: install package as dev dependency
* nodemon: use for live reload

`npx nodemon index.js`: run installed dependencies from the command line in the current project, not globally. Use the right versions of modules and stops our system from getting cluttered up by globally installed modules

`npm run start:dev`: start the app in dev env after adding `start:dev` to package.json


## 2. For prod environment

Install dependencies only for production env: `npm install --only=production`

When we run npm install `--only=production`, then the packages we install to help with development, like nodemon, will be excluded.

Run the project in production mode: `npm start` after add `start` to package.json


# Docker

## 1. Docker image

## 1.1. Build Docker Images

Follow this for docker image build on Mac M1: 

[How to Actually Deploy Docker Images Built on M1 Macs With Apple Silicon](https://betterprogramming.pub/how-to-actually-deploy-docker-images-built-on-a-m1-macs-with-apple-silicon-a35e39318e97)

[Docker, M1 Macs and EKS issue: exec format error](https://blog.ccavazos.co/posts/m1-docker-eks)

[standard_init_linux.go:228: exec user process caused: exec format error](https://akashmittal.com/docker-exec-format-error/)

    docker build -t video-streaming --file Dockerfile .

    docker build -t <your-name-for-the-image> --file <path-to-your-Dockerfile>  <path-to-project>

* *The -t argument allows us to tag or name our image*
* *The --file argument specifies the name of the Dockerfile to use.*
* *The dot `.`*: It tells the build command to operate against the current directory.

## 1.2. Publish Docker Image to Cloud Registry

* Create Container Registry on Azure

* authenticate with `docker login`

    docker login <cr url> --username <user> --password <password>

* publish `docker push`

    docker tag <existing-image> <registry-url>/<image-name-registry>:<version>

    docker push <registry-url>/<image-name-registry>:<version>

* test with `docker run`

## 1.3. Remove Docker Image

    docker rmi <your-image-id> --force

* Use --force to remove all tagged versions of an image these are all removed.

## 2. Docker Container

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

Restart a container

    docker restart <container-name>

Check logs 

    kubectl -n default logs <pod-name> > pod.log

    kubectl describe pod <pod-name>

## 3. Docker Compose

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

Run docker-compose with separate files for dev and prod

    docker-compose -f docker-compose-dev.yml up --build
    docker-compose -f docker-compose-prod.yml up --build



## 4. Add sercret using Docker Swarm Stack

https://www.rockyourcode.com/using-docker-secrets-with-docker-compose/

    docker swarm init

    printf "anhtestvideos" | docker secret create storage_account_name - 

    docker secret inspect storage_account_name 



# Database and Storage

1. Install `mongodb` in video-streaming microservice
    
    npm install --save mongodb

2. Run docker-compose to start all services

3. connect to mongodb on host:4000
create video-streaming db, videos collection
add video-record

4. check video-streaming localhost

    http://localhost:4002/video?id=5d9e690ad76fe06a3d7ae416


# Communication between microservices

## 1. Direct messaging/Synchronous

**Direct messaging/Synchronous**: Direct messaging means that one microservice directly sends a message to another microservice and then receives an immediate and direct response. Direct messaging is used when we’d like one microservice to directly message a particular microservice and immediately invoke an action or task within it. The recipient microservice can’t ignore or avoid the incoming message. If it were to do so, the sender will know about it directly from the response.
* A potential benefit of direct messaging is the ability to have one controller microservice that can orchestrate complex sequences of behavior across multiple other microservices. Because direct messages have a direct response, this allows a single microservice to coordinate or orchestrate the activities of multiple other microservices.
* Drawbacks:
    * High coupling between microservices
    * A message can be received by only 1 microservice at a time
    * Single point of failure if the controlling microservice crashes
* HTTP: Hypertext Transfer Protocol (HTTP) is used to send direct (or synchronous) messages from one microservice to another.


## 2. Indirect message/Asynchronous

**Indirect message/Asynchronous**: Messages are sent via an intermediary so that both sender and receiver of the messages don’t know which other microservice is involved. In the case of the sender, it doesn’t even know if any other microservice will receive the message at all! Because the receiver doesn’t know which microservice has sent the message, it can’t send a direct reply. 

* Benefits:
    * This method of communication losely couple the microservices. 
    * It gives more control to the receiver. When the receiver is overwhelmed and has no capacity to accept new messages, it is free to just ignore these, letting those pile up in the queue until it is able to handle them.

* Drawbacks: this style of communication can’t be applied in situations where a direct response is required for confirming success or failure. 

* RabbitMQ: RabbitMQ is the message queuing software that we’ll use to send indirect (or asynchronous) messages from one microservice to another. RabbitMQ allows us to decouple message senders from message receivers. A sender doesn’t know which, if any, other microservices will handle a message. RabbitMQ implements the Advanced Message Queueing Protocol (AMQP), which is an open standard for message-broker communication.

* amqplib: RabbitMQ has libraries for all the popular programming languages. `amqplib` is npm package allows us to configure RabbitMQ and to send and receive messages with Nodejs

* The message sender uses DNS to resolve the IP address of the RabbitMQ server. It then communicates with it to publish a message on a particular named queue or exchange. The receiver also uses DNS to locate the RabbitMQ server and communicate with it to retrieve the message from the queue. At no point do the sender and receiver communicate directly.

### 2.1 Use RabbitMQ for Indirect messaging

1. Add rabbitmq container to docker-compose-dev
2. Run `docker-compose -f docker-compose-dev.yml up --build`
3. Access rabbitmq dashboard at `localhost:15672/#/queues` with username:guest, password:guest
4. Install amqplib to each microservice that requires rabbitmq:
    * history service: receiving message
    * video-streaming service: sending message

Use `npm install --save wait-port` to wait for RabbitMQ to start before running the history and video streaming microservice

Add `npx wait-port rabbit:5672` to history and video-streaming Dockerfile CMD: Uses npx to invoke the locally installed wait-port command to wait until the server at hostname rabbit is accepting connections on port 5672

### 2.2 Single-receipient indirect messaging

 Single-recipient messages are one-to-one : a message is sent from one microservice and received by only a single other. This is a great way of making sure that a particular job is done only once within your application.

 'Assert queue': checking for the existence of the queue and then only creating it when it doesn’t already exist. The queue is created once and shared between all participating microservices

 RabbitMQ is agnostic about the format of the message payload, so it doesn’t natively support JSON. We must therefore manually parse the incoming message payload.

### 2.3 Multiple-receipient indirect messaging

NOTE Multiple-recipient messages are one-to-many : a message is sent from only a single microservice but potentially received by many others. This is a great way of publishing notifications within your application.


# Azure AKS

## Azure CLI

`https://learn.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest`

    az login

    az account set --subscription=<subscription-id>

    az account show

    az account list -o table

    # Create a service principal with azure RBAC

    az ad sp create-for-rbac --name "AnhFlixtube" --role="Contributor" --scopes="/subscriptions/<subscriptionid>/resourceGroups/<rg>"

    # Check the version number for AKS

    az aks get-versions --location westus -o table : 
    
    # Creates Kubectl config file at `~/.kube/config`

    az aks get-credentials --resource-group <rg> --name <cluster>


## Terraform

    terraform init

    terraform apply

    terraform apply -auto-approve

    terraform apply -var="key=value" -auto-approve

    terraform destroy

## Kubernetes

### kubectl

    kubectl version

    kubectl get nodes : show list of nodes

    kubectl get pods --all-namespaces

    kubectl get pods -n <NAMESPACE>

    kubectl get services

### K8s dashboard

    # Install
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.4/aio/deploy/recommended.yaml

    # Use Kubectl to create a proxy that allows us to access the dashboard from our development workstation:
    
    kubectl proxy

    kubectl proxy --address=0.0.0.0

    # access k8s dashboard -> not working as expected (404 error)

    http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

    # check status of the dashboard pods

    kubectl -n kubernetes-dashboard describe pod kubernetes-dashboard-7c89d9f89c-hnsvq

    # check logs

    kubectl -n kubernetes-dashboard logs <POD_NAME>














