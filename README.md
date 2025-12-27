# Yt2MP3 – YouTube-to-MP3 Converter & Metadata Editor

---

## 🔹 Project Overview

Yt2MP3 is a **full-stack web application** that allows users to extract audio from online videos and convert them to MP3 format. The tool also supports **metadata editing**, giving users control over their audio files.  

The project demonstrates integration of **Node.js server functionality**, **Python scripting for metadata processing**, and **system-level tools** such as FFmpeg.

**Tech Stack:**
- **Backend:** Node.js, Express  
- **Frontend:** EJS templates, HTML/CSS  
- **Python:** `eyed3` for metadata editing  
- **Utilities:** FFmpeg, yt-dlp  

---

## 🔹 Features

- Extract audio streams from online videos and convert them to MP3  
- Edit MP3 metadata: title, artist, album, genre, track number, and cover art  
- Manage uploaded files and conversion history  
- Simple web interface for seamless interaction  
- Modular backend integration using Node.js and Python  

---

## 🔹 Legal / Usage Disclaimer

This project is for **educational and personal use only**.  

Yt2MP3 is a media processing tool designed to demonstrate audio extraction, conversion, and metadata editing using open-source resources. Users are responsible for ensuring they have the legal right to download, convert, or process any media content.

This tool should only be used with:

- Content you own  
- Content where you have explicit permission from the copyright holder  

The author does **not** condone or encourage copyright infringement or violation of YouTube’s Terms of Service.

---

## 🔹 Setup Instructions

1. Clone the repository with `git clone https://github.com/CadenBurks/Yt2MP3.git` and `cd Yt2MP3`. 
2. Install Node.js dependencies by ensuring Node.js is installed, then run `npm install`. 
3. Install Python dependencies by ensuring Python 3 is installed, creating a virtual environment with `python -m venv venv`, activating it (`venv\Scripts\activate` on Windows or `source venv/bin/activate` on macOS/Linux), and running `pip install -r requirements.txt` to install `eyed3` and `yt-dlp`. 
4. Install FFmpeg (required for audio conversion) by downloading it from [FFmpeg.org](https://ffmpeg.org/) and adding it to your PATH on Windows, or using `brew install ffmpeg` on macOS, or `sudo apt install ffmpeg` on Linux. Configure environment variables by creating a `.env` file with `PORT=3000` and optionally `FFMPEG_PATH=/full/path/to/ffmpeg` if FFmpeg is not in your system PATH.
5. Run the server using `npm start`, it will then open your browser at [http://localhost:3000](http://localhost:3000).
6. To download audio from a YouTube video, copy the video's ID and paste it into the conversion box.
7. Use the metadata editor by uploading an MP3 file (and optionally a cover image) and editing fields such as title, artist, album, year, genre, and track number, then clicking **Update Metadata**; the edited file will be saved in the `downloads` folder and available for download. The application tracks the last 10 conversions or metadata updates, showing timestamp, title, and download link.
