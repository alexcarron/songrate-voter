import { useState } from 'react';
import './App.css'
import { downloadSong } from './services/song-downloader';
import { getIDFromSpotifyPlaylistURL, getSongDetailsFromPlaylistURL } from './services/spotify-playlist-extractor';
import type Song from './Song';
import SongComponent from './SongComponent';

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
												id: songDetail.id,
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
					<SongComponent
						key={index}
						song={song}
					/>
				))}
			</div>
    </main>
		)
}

export default App
