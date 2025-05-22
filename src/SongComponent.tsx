import { useState } from "react";
import type Song from "./Song";

function SongComponent({
	song
}: {
	song: Song;
}) {
	const [showSpotifyEmbed, setShowSpotifyEmbed] = useState(true);

	return (
		<article className="song">
			<section className="leftSection">
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
				<header>
					<h2 className="song-title">{song.songName}</h2>
					<p className="song-artists">{song.artists.join(', ')}</p>
					<p className="song-album">{song.album}</p>
				</header>
			</section>
			<section className="rating">
				{
					showSpotifyEmbed
						? <iframe src={`https://open.spotify.com/embed/track/${song.id}?utm_source=generator&theme=0`} width="100%" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
						: <div className="audio">
								<audio className="song-audio" controls src={song.audioURL}></audio>
							</div>
				}
				<input type="checkbox" name="showSpotifyEmbed" id="showSpotifyEmbed" checked={showSpotifyEmbed} onChange={() => setShowSpotifyEmbed(!showSpotifyEmbed)} />
			</section>
		</article>
	)
}

export default SongComponent;