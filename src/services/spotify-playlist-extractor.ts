const API_URL: string = 'https://api.spotify.com/v1';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

interface SongDetails {
  songName: string;
  artists: string[];
  album: string;
}

interface SpotifyTrack {
  track: {
    name: string;
    artists: { name: string }[];
    album: {
      name: string;
    };
  };
}


const getPlaylistIDFromURL = (url: string): string => {
  const afterPlaylist = url.split('playlist/')[1];
  const beforeQuestionMark = afterPlaylist.split('?')[0];
  return beforeQuestionMark;
};

async function sendAuthorizationRequest(): Promise<string | null> {
  const clientID = CLIENT_ID;
  const clientSecret = CLIENT_SECRET;
  const authHeader = 'Basic ' + btoa(`${clientID}:${clientSecret}`);

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch access token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
}

async function getPlaylistTracks(accessToken: string, playlistId: string): Promise<SpotifyTrack[]> {
  try {
    const response = await fetch(`${API_URL}/playlists/${playlistId}/tracks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist tracks: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    return [];
  }
}

function extractSongDetails(tracks: SpotifyTrack[]): SongDetails[] {
  return tracks.map((track) => {
    const songName = track.track.name;
    const artists = track.track.artists.map((artist: {name: string}) => artist.name);
    const album = track.track.album.name;
    return { songName, artists, album };
  });
}

export async function getSongDetailsFromPlaylistURL(playlistUrl: string): Promise<SongDetails[]> {
  const playlistId = getPlaylistIDFromURL(playlistUrl);
  const accessToken = await sendAuthorizationRequest();
  if (!accessToken) return [];
  const tracks = await getPlaylistTracks(accessToken, playlistId);
  return extractSongDetails(tracks);
}

export const getIDFromSpotifyPlaylistURL = (url: string) => {
		console.log('getPlaylistIDFromURL called with', url);

		// Example link: https://open.spotify.com/playlist/1N63LQ4YkksR6kxvtfnyKs?si=100567e3744340c2
		// id after playlist/ is 22 characters long and in base-62 which includes uppercase letters (A–Z), lowercase letters (a–z), and digits (0–9)

		const playlistPrefix = 'open.spotify.com/playlist/';
		const hasPlaylistPrefix = url.indexOf(playlistPrefix) !== -1;

		if (!hasPlaylistPrefix) {
			console.log('No playlist prefix found in URL');
			throw new Error('Missing playlist prefix in URL');
		}

		let strippedURL = url.substring(url.indexOf(playlistPrefix) + playlistPrefix.length);

		console.log('Stripped URL is', strippedURL);

		const ID_LENGTH = 22;
		const hasID = strippedURL.length >= ID_LENGTH;

		if (!hasID) {
			console.log('No ID found in URL');
			throw new Error('Missing ID in URL');
		}

		// Strip query string if exists
		if (strippedURL.indexOf('?') !== -1) {
			const queryFreeURL = strippedURL.substring(0, strippedURL.indexOf('?'));
			console.log('Query string found in URL, stripping it');
			strippedURL = queryFreeURL;
		}

		// Check if remaining ID correct length
		const hasCorrectIDLength = strippedURL.length === ID_LENGTH;

		if (!hasCorrectIDLength) {
			console.log('Incorrect ID length found in URL');
			throw new Error('Incorrect ID length in URL');
		}

		console.log('Returning ID', strippedURL);
		return strippedURL;
	}