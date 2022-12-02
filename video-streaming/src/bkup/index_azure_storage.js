const express = require("express");
const http = require("http");
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


// --- Main function ---
app.get("/video", (req, res) => {
    //  Forwards the HTTP GET request to the video route to the video-storage microservice
    const forwardRequest = http.request(
        {
            // set host and port of the forward to service
            host: VIDEO_STORAGE_HOST,
            port: VIDEO_STORAGE_PORT,
            path: '/video?path=big_buck_bunny_240p_30mb.mp4',
            // forwarding as an HTTP GET request
            method: 'GET',
            // forwarding the headers
            headers: req.headers        
        },
        // Gets the response from the forwarded request
        forwardResponse => 
        {
            //Returns the status code and header of the forwarded request
            res.writeHeader(forwardResponse.statusCode, forwardResponse.headers);
            //Pipes the response stream using Node.js streams
            forwardResponse.pipe(res);
        }
    );
    //Pipes the request stream using Node.js streams
    req.pipe(forwardRequest);
});

app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}!, check http://localhost:${HOST}/video`);
});