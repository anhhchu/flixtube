const express = require("express");
const http = require("http");
const mongodb = require("mongodb");
const app = express();
// add environment variable
if (!process.env.PORT) {
    throw new Error("Please specify the PORT number");
};
if (!process.env.VIDEO_STORAGE_HOST) {
    throw new Error("Please specify the VIDEO_STORAGE_HOST number");
};
if (!process.env.VIDEO_STORAGE_PORT) {
    throw new Error("Please specify the VIDEO_STORAGE_PORT number");
};

const PORT = process.env.PORT;
const HOST = process.env.HOST;

// config video storage microservices
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT);
console.log(`Forwarding video requests to ${VIDEO_STORAGE_HOST}:${VIDEO_STORAGE_PORT}.`);

// config database
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

// --- Main function ---
function main() {
 // Connect to database server
 return mongodb.MongoClient.connect(DBHOST)
  .then (client => {
        // retrieve the database that the microservice uses
        const db = client.db(DBNAME);
        // retrieve videosCollection document in DB where metadata is stored
        const videosCollection = db.collection(videos);

        app.get("/video", (req, res) => {
            // specfiy video ID (MongoDB Document ID) as HTTP query parameter
            const videoId = new mongodb.ObjectID(req.query.id);
            
            videosCollection
                // query database to find the video by requested ID
                .findOne({_id: videoId})
                // get the videoRecord from the videoId 
                .then(videoRecord => {
                        // if video is not found -> http 404 error
                        if (!videoRecord) {
                            res.sendStatus(404);
                            return;
                        }
                        // else,find the videoPath based on the videoRecord when forwarding http request to video-storage micro service
                        const forwardRequest = http.request(
                            {
                                host: VIDEO_STORAGE_HOST,
                                port: VIDEO_STORAGE_PORT,
                                path: `/video?path=${videoRecord.videoPath}`,
                                method: 'GET',
                                headers: req.headers
                            },
                            forwardResponse => {
                                res.writeHeader(forwardResponse.statusCode, forwardResponse.headers);
                                forwardResponse.pipe(res);
                            }
                        );
                        req.pipe(forwardRequest);
                })
                // catch Database query error
                .catch(err => {
                        console.error("Database query failed.");
                        console.error(err && err.stack || err);
                        // Response code 500 : Internal Server Error
                        res.sendStatus(500);
                })
        })
    })
}
// Call main function
// Start the micro service
main()
    .then(() => console.log("video-streaming microservice online"))
    .catch(err => {
        console.error("video-streaming failed to start");
        console.error(err && err.stack || err)
    });
