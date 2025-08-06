// necessary packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// create express server
const app = express();

// server ports (heroku and local)
const PORT = process.env.PORT || 3000;

// set ejs template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// info needed to parse html for POST request
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

// routes
app.get("/", (req, res) => {
    res.render("index")
})
app.get("/singleuse", (req, res) => {
    res.render("singleuse");
});
app.get("/library", (req, res) => {
    res.render("library");
});

const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
// Downloads for MP3
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

app.post("/convert-mp3", async (req, res) => {
  const videoID = req.body.videoID.trim();
  const YT_URL = `https://www.youtube.com/watch?v=${videoID}`;

  if (!videoID) {
    return res.render("index", { success: false, message: "Please enter a video ID" });
  }

  const outputPath = path.join(__dirname, "downloads", `${videoID}.mp3`);

  // Make sure downloads folder exists
  fs.mkdirSync(path.join(__dirname, "downloads"), { recursive: true });
  
  const ffmpegPath = "C:\\ffmpeg\\ffmpeg-7.1.1-full_build\\bin"

  const cmd = `yt-dlp -x --audio-format mp3 -o "${outputPath}" --ffmpeg-location "${ffmpegPath}" "${YT_URL}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("yt-dlp error:", stderr);
      return res.render("index", { success: false, message: "Failed to download MP3." });
    }

    console.log("yt-dlp output:", stdout);

    // Send a link to download the file
    const downloadLink = `/downloads/${videoID}.mp3`;
    res.render("index", { success: true, song_title: `Video ID: ${videoID}`, song_link: downloadLink });
  });
});

// app.post("/convert-mp3", async (req, res) => {
//     const videoID = req.body.videoID.trim();
//     // check if ID is valid
//     if(videoID === undefined || videoID === "" || videoID === null)
//     {
//         return res.render("index", {success : false, message : "Please enter a video ID"});
//     }
//     else
//     {
//         const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`, {
//             "method" : "GET",
//             "headers": {
//                 "x-rapidapi-key" : process.env.API_KEY,
//                 "x-rapidapi-host": process.env.API_HOST
//             }
//         });

//         const fetchResponse = await fetchAPI.json();

//         if(fetchResponse.status === "ok")
//             return res.render("index", {success : true, song_title: fetchResponse.title, song_link : fetchResponse.link});
//         else
//             return res.render("index", {success: false, message: fetchResponse.msg})
//     }
// })

// start server
app.listen(PORT, () =>{
    console.log(`Server started on port ${PORT}`);
})