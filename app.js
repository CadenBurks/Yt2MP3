// necessary packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// action history queue
const historyQueue = [];
const MAX_HISTORY = 10;

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

// Get route
app.get("/", (req, res) => {
  res.render("index", { history: historyQueue });
});

const { exec } = require("child_process");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "temp_uploads") });

app.use('/downloads', express.static(path.join(__dirname, 'downloads')));
app.use('/temp_uploads', express.static(path.join(__dirname, 'temp_uploads')));

app.post("/convert-mp3", async (req, res) => {
  const videoID = req.body.videoID.trim();
  const YT_URL = `https://www.youtube.com/watch?v=${videoID}`;

  if (!videoID) {
    return res.render("index", {
      success: false,
      message: "Please enter a video ID",
      history: historyQueue,
    });
  }

  const outputPath = path.join(__dirname, "downloads", `${videoID}.mp3`);
  const ffmpegPath = "C:\\ffmpeg\\ffmpeg-7.1.1-full_build\\bin";

  const getTitleCmd = `yt-dlp --print "%(title)s" "${YT_URL}"`;

  exec(getTitleCmd, (titleErr, titleStdout, titleStderr) => {
    if (titleErr) {
      console.error("Error getting video title:", titleStderr);
      return res.render("index", {
        converterSuccess: false,
        converterMessage: "Failed to fetch video title.",
        metadataSuccess: undefined,
        metadataMessage: undefined,
        history: historyQueue
      });
    }

    const videoTitle = titleStdout.trim();  // The actual song name/title

    const convertCmd = `yt-dlp -x --audio-format mp3 -o "${outputPath}" --ffmpeg-location "${ffmpegPath}" "${YT_URL}"`;

    exec(convertCmd, (convertErr, stdout, stderr) => {
      if (convertErr) {
        console.error("yt-dlp error:", stderr);
        return res.render("index", {
          converterSuccess: false,
          converterMessage: "Failed to download MP3.",
          metadataSuccess: undefined,
          metadataMessage: undefined,
          history: historyQueue
        });
      }

      console.log("yt-dlp output:", stdout);

      const downloadLink = `/downloads/${videoID}.mp3`;

      // Add to history with real title
      historyQueue.unshift({
        type: "conversion",
        videoID,
        songTitle: videoTitle,
        songLink: downloadLink,
        timestamp: new Date(),
      });
      if (historyQueue.length > MAX_HISTORY) historyQueue.pop();

      res.render("index", {
        converterSuccess: true,
        converterMessage: "Conversion complete!",
        song_title: videoTitle,
        song_link: downloadLink,
        metadataSuccess: undefined,
        metadataMessage: undefined,
        history: historyQueue,
      });
    });
  });
});


// POST route to handle metadata update form
app.post(
  "/update-metadata",
  upload.fields([
    { name: "mp3File", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // User-input files
      const mp3File = req.files["mp3File"] ? req.files["mp3File"][0] : null;
      const coverImage = req.files["coverImage"] ? req.files["coverImage"][0] : null;

      if (!mp3File) {
        return res.status(400).send("MP3 file is required.");
      }

      // Form fields
      const { title, artist, album, year, genre } = req.body;
      const metadata = {
      title: req.body.title || "",
      artist: req.body.artist || "",
      album: req.body.album || "",
      year: req.body.year || "",
      genre: req.body.genre || "",
      };

      console.log("MP3 file:", mp3File);
      console.log("Cover image:", coverImage);
      console.log("Metadata:", { title, artist, album, year, genre });

      const pythonInput = JSON.stringify({
      file_path: mp3File.path,
      art_path: coverImage ? coverImage.path : null,
      metadata,

      });

// Cleanup files
const cleanupFiles = () => {
  if (mp3File && fs.existsSync(mp3File.path)) {
    fs.unlinkSync(mp3File.path);
  }
  if (coverImage && fs.existsSync(coverImage.path)) {
    fs.unlinkSync(coverImage.path);
  }
};

execFile("python", ["C:\\GitRepos\\Yt2MP3\\mp3cover.py", pythonInput], 
  (error, stdout, stderr) => {
    if (error) {
      console.error("Python script error:", stderr);
      cleanupFiles();
      return res.status(500).render("index", {
      metadataSuccess: false,
      metadataMessage: "Failed to update metadata.",
      converterSuccess: undefined,
      converterMessage: undefined,
      });
    }

    console.log("Python output:", stdout);
    
    // Move the processed file to downloads folder
    const outputPath = path.join(__dirname, "downloads", mp3File.originalname);
    fs.copyFileSync(mp3File.path, outputPath);
    
    cleanupFiles();

    const downloadUrl = `/downloads/${mp3File.originalname}`;
    
    // Add success to history queue
    historyQueue.unshift({
    type: "metadata",
    metadata: {
    title: metadata.title,
    artist: metadata.artist,
    album: metadata.album,
    year: metadata.year,
    genre: metadata.genre,
    },
    downloadLink: downloadUrl,
    fileName: mp3File.originalname,
    timestamp: new Date(),
    });
    if (historyQueue.length > MAX_HISTORY) historyQueue.pop();

    // render message after success
    res.render("index", {
    metadataSuccess: true,
    metadataMessage: "Metadata updated!",
    download_link: downloadUrl,
    converterSuccess: undefined,
    converterMessage: undefined,
    history: historyQueue
    });

  }
);
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to update metadata");
    }
  }

);

// start server
app.listen(PORT, () =>{
    console.log(`Server started on port ${PORT}`);
})