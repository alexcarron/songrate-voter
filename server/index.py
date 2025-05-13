from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import yt_dlp
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DOWNLOAD_FOLDER = os.path.abspath("./downloads")
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)


def download_song_audio(song_name, artist_name, album_name):
    search_query = f'"{song_name}" "{artist_name}" "{album_name}" "Topic"'
    temp_file_name = f"{song_name} - {artist_name}.%(ext)s"
    temp_output_path = os.path.join(DOWNLOAD_FOLDER, temp_file_name)

    ydl_opts = {
        'format': 'bestaudio',
        'noplaylist': True,
        'outtmpl': temp_output_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '0',
        }],
        'quiet': False,
        'default_search': 'ytsearch1',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print(f"Searching and downloading: {search_query}")
            ydl.download([search_query])

        # Dynamically find the most recently created mp3 file in the folder
        files = [os.path.join(DOWNLOAD_FOLDER, f) for f in os.listdir(DOWNLOAD_FOLDER) if f.endswith(".mp3")]
        if files:
            latest_file = max(files, key=os.path.getctime)
            print(f"Found downloaded file: {latest_file}")
            return latest_file

        raise FileNotFoundError("Downloaded file not found.")
    except Exception as e:
        print(f"Error during download: {e}")
        return None


@app.route("/download", methods=["POST"])
def download():
    data = request.json
    song_name = data.get("song_name", "")
    artist_name = data.get("artist_name", "")
    album_name = data.get("album_name", "")

    if not song_name or not artist_name:
        return jsonify({"error": "Song name and artist name are required."}), 400

    file_path = download_song_audio(song_name, artist_name, album_name)
    if file_path and os.path.exists(file_path):
        @after_this_request
        def remove_file(response):
            try:
                os.remove(file_path)
                print(f"Successfully deleted file: {file_path}")
            except Exception as e:
                print(f"Error deleting file: {e}")
            return response

        try:
            print(f"Sending file: {file_path}")
            return send_file(file_path, as_attachment=True)
        except Exception as e:
            print(f"Error sending file: {e}")
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Failed to download the song or file not found."}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
