const express = require("express");
const mongodb = require("mongodb");
const bodyParser = require('body-parser');
const amqp = require("ampqlib");

if (!process.env.DBHOST) {
    throw new Error("Please specify the databse host using environment variable DBHOST.");
}

if (!process.env.DBNAME) {
    throw new Error("Please specify the name of the database using environment variable DBNAME");
}

if (!process.env.RABBIT) {
    throw new Error("Please specify the name of the database using environment variable RABBIT");
}

const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;
const RABBIT = process.env.RABBIT;

//
// Connect to the database.
//
function connectDb() {
    return mongodb.MongoClient.connect(DBHOST) 
        .then(client => {
            return client.db(DBNAME);
        });
}

//
// Connect to the rabbitmq server.
//
function connectRabbit() {
    console.log(`Connecting to RabbitMQ server at ${RABBIT}`)
    return amqp.connect(RABBIT) 
        .then (messagingConnection => { // this is just a function without name and with argument messagingConnection 
            console.log(`Connected to RabbitMQ`)
            //create RabbitMQ messaging channel and return it -> we call it messageChannel in other functions
            return messagingConnection.createChannel();
        });
}

//
// Set up event handler with RabbitMQ
//

// the setupHandlers function sets up a handler for consuming messages from a RabbitMQ message queue and inserting them into a MongoDB database. It takes in three arguments: app, db, and messageChannel. The videosCollection variable is created to reference the "videos" collection in the database.

// The consumeViewedMessage function is defined to handle messages from the queue. It logs the received message and parses it as a JSON object. The message is then inserted into the database, and the message channel is acknowledged that the message has been handled.

// Finally, the function asserts that the "viewed" queue exists and begins consuming messages from that queue, using the consumeViewedMessage function as a handler.

function setupHandlers(app, db, messageChannel) {
    const videosCollection = db.collection("videos");

    function consumeViewedMessage(msq) { // Add message from rabbitmq queue to database
        console.log(`Received a viewed message ${msg}`);
        
        //RabbitMQ doesn’t natively support JSON. We must therefore manually parse the incoming message payload.
        const parsedMsg = JSON.parse(msg.content.toString()); 

        return videosCollection.insertOne( { videoPath: parsedMsg.videoPath })  // Record the view in the database
            .then(() => { 
                console.log("messageChannel acknowledge that message is handled by db")
                messageChannel.ack(msg);
            });
    }

    // checking for the existence of 'viewed' queue and then only creating it when it doesn’t already exist. The queue is created once and shared between all participating microservices
    return messageChannel.assertQueue("viewed", {}) 
        .then (() => {
            console.log("Viewed queue exist, start consuming message from viewed queue to DB");
            return messageChannel.consume("viewed", consumeViewedMessage); 
        });
}

//
// Start Http server
//

// This is a JavaScript function that sets up an HTTP server using the express library. 
// It takes two arguments: db and messageChannel, which are used to set up the server's request handlers. 
// The bodyParser.json() middleware is used to enable parsing of JSON bodies in incoming requests. 
// The server listens on port 3000 by default, or on the port specified in the PORT environment variable if it is set. 
// When the server is successfully started, it resolves the returned promise.

function startHttpServer(db, messageChannel ) {
    return new Promise( resolve => { // this is an arrow function with resolve as argument
        const app = express();
        app.use(bodyParser.json()); // enable json body parser for http requests
        setupHandlers(app, db, messageChannel);

        const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
        console.log(process.env.PORT,  parseInt(process.env.PORT))
        app.listen(port, () => {
            console.log(`history app listens from ${port}`);
            resolve(); // resolve the promise
        });
    });
}

function main() {
    console.log("Test history microservice with RabbitMQ");
    return connectDb()
        .then(db => { // db is what connectDb() function returns
            return connectRabbit()
                .then(messageChannel => { // messageChannel is what connectRabbit() function returns,
                    //  we pass db and messageChannel  to the next function to start the HttpServer
                    return startHttpServer(db, messageChannel);
            });
    });
};

main()
    .then(() => {console.log("History microservice online!")})
    .cath((err) => {
        console.log("Microservice failed to start");
        console.log(err && err.stack || err);
    })

