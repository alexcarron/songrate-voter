
# Song Downloader and Rating System

## Overview

This project is a web application that allows users to preview and rate songs from Spotify playlists. The project consists of a local backend server built with Flask and a React frontend. It uses the Spotify API to extract song details and the yt_dlp library to download audio files from YouTube.

## Features

* Dynamic input field for pasting Spotify playlist links
* Loading indicator for downloading songs
* Download songs from YouTube using the `yt_dlp` library
* Rate songs from 0 to 11
* User-friendly interface built with React

## Setup

### Prerequisites

* Node.js (14.x or higher)
* Python (3.8.x or higher)
* Flask (2.x or higher)
* yt_dlp (2021.x or higher)
* Spotify API credentials (Client ID and Client Secret)

### Start App

* Clone the repository: `git clone https://github.com/alexcarron/songrate-voter.git`
* Navigate to the repository directory `cd songrate-voter`
* Run the script to start the app `./start-app.sh`

## Usage

### 1. Open webpage

Open the URL shown in the terminal after running the Vite server.

![Vite Console Screenshot](./screenshots/vite-console-screenshot.png)

You will be greeted with an empty input field

![React App Empty Input Screenshot](./screenshots/paste-link-screenshot.png)

### 2. Paste a link

Paste a Spotify playlist link into the input field

![Pasted Link Screenshot](./screenshots/pasted-link-screenshot.png)

### 3. Wait

Wait for the songs to finish downloading once the loading indicator vanishes

![Songs Finished Downloading Screenshot](./screenshots/loaded-songs-screenshot.png)

### 4. Listen & Rate!

Listen to the displayed songs and select your ratings for them

![Listening To and Rating a Song Screenshot](./screenshots/listening-to-and-rating-song-screenshot.png)

## Technical Details

* **Frontend**: React, TypeScript, CSS
* **Backend**: Flask, Python, yt_dlp
* **Spotify API**: Used to extract song details from playlists
* **Vite**: Used as a development server and build tool