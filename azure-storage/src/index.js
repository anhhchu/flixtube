const express = require("express");
const azure = require("azure-storage")
const app = express();

// add environment variable

if (!process.env.PORT) {
    throw new Error("Please specify the PORT number");
};
if (!process.env.STORAGE_ACCOUNT_NAME) {
    throw new Error("Please specify the STORAGE_ACCOUNT_NAME");
};
if (!process.env.STORAGE_ACCESS_KEY) {
    throw new Error("Please specify the STORAGE_ACCESS_KEY");
};

const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;
const PORT = process.env.PORT;
const HOST = process.env.HOST;

console.log(`Serving videos from Azure storage account ${STORAGE_ACCOUNT_NAME}.`);

function createBlobService () {
    const blobService = azure.createBlobService(STORAGE_ACCOUNT_NAME, STORAGE_ACCESS_KEY);
    return blobService;
}; 

app.get("/video", (req, res) => {
    const videoPath = req.query.path;
    const blobService = createBlobService();
    const containerName = "videos";

    blobService.getBlobProperties(containerName, videoPath, (err, properties) => {
        if (err) {
            console.error(`Error occurred getting properties for video ${containerName}/${videoPath}.`);
            console.error(err && err.stack || err);
            res.sendStatus(500);
            return;
        }
        res.writeHead (200, {
            "Content-Length": properties.contentLength,
            "Content-Type": "video/mp4",
        });
        blobService.getBlobToStream(containerName, videoPath, res, err => {
            if (err) {
                console.error(`Error occurred getting video ${containerName}/${videoPath} to stream.`);
                console.error(err && err.stack || err);
                res.sendStatus(500);
                return;
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`video-storage microservice listening on PORT ${PORT}!, check http://localhost:${HOST}/video?path=big_buck_bunny_240p_30mb.mp4`);
});