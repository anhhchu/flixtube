const express = require("express");
const fs = require("fs");
const app = express();

// add environment variable

// if (!process.env.PORT) {
//     throw new Error ("Please specify the PORT number");
// };

const PORT = 3000;

app.get("/video", (req, res) => {
    const path = "./videos/big_buck_bunny_240p_30mb.mp4";
    fs.stat(path, (err, stats) => {
        if (err) {
            console.error("Video file not found");
            res.sendStatus(500);
            return;
        }
        res.writeHead(200, {
            "Content-Length": stats.size,
            "Content-Type": "video/mp4"

        });
        fs.createReadStream(path).pipe(res);
    });
});

app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}!, check http://localhost:3000/video `);
});