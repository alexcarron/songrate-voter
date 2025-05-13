import { useState } from 'react';
import './App.css'
import { downloadSong } from './services/song-downloader';
import { getIDFromSpotifyPlaylistURL, getSongDetailsFromPlaylistURL } from './services/spotify-playlist-extractor';

interface Song {
	songName: string;
	artists: string[];
	album: string;
	audioURL: string;
}

function App() {
	const [songs, setSongs] = useState<Song[]>([]);
	const [songLoading, setSongLoading] = useState<string | null>(null);

	const growWithInput = (inputElement: HTMLInputElement) => {
		const numberOfCharacters = inputElement.value.length;
		inputElement.style.width = (numberOfCharacters + 1) + 'ch';
	}

  return (
    <main>
			<div className="input-container">
				<input
						type="text"
						placeholder="Paste spotify playlist link"
						disabled={songLoading !== null}
						onInput={async (event) => {
							const inputElement = event.target as HTMLInputElement;
							growWithInput(inputElement)
							try {
								const playlistURL = inputElement.value;
								getIDFromSpotifyPlaylistURL(playlistURL);
								inputElement.classList.add('correct');

								setSongLoading('');
								setSongs([]);

								const songDetails = await getSongDetailsFromPlaylistURL(playlistURL);

								console.log('songDetails', songDetails);

								for (const songDetail of songDetails) {
									console.log(songDetail.songName, songDetail.artists, songDetail.album);

									setSongLoading(
										`${songDetail.songName} by ${songDetail.artists[0]} from ${songDetail.album}`
									);

									const response = await downloadSong(
										songDetail.songName,
										songDetail.artists[0],
										songDetail.album
									);
									console.log('response', response);
									if (response === undefined) throw new Error('Failed to download the song: response is undefined.');

									const audioURL = response.audioURL;
									if (audioURL === undefined) throw new Error('Failed to download the song: audioURL is undefined.');

									setSongs(prevSongs =>
										[...prevSongs,
											{
												songName: songDetail.songName,
												artists: songDetail.artists,
												album: songDetail.album,
												audioURL: audioURL
											}
										]
									);
								}
							}
							catch (error) {
								inputElement.classList.remove('correct');
								console.error(error);
							}
							finally {
								setSongLoading(null);
							}
						}}
					/>
					{
						songLoading &&
						<p className="loading-indicator"> Loading <strong>{songLoading}</strong>... </p>
					}
			</div>
			<div className="songs">
				{songs.map((song, index) => (
					<article key={index} className="song">
						<header>
							<h2 className="song-title">{song.songName}</h2>
							<p className="song-artists">{song.artists.join(', ')}</p>
							<p className="song-album">{song.album}</p>
						</header>
						<section className="rating">
							<select name="rating" className="rating">
								<option value="1">0</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
								<option value="9">9</option>
								<option value="10">10</option>
								<option value="10">11</option>
							</select>
							<audio className="song-audio" controls src={song.audioURL}></audio>
						</section>
					</article>
				))}
			</div>
    </main>
		)
}

export default App
