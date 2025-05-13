export async function downloadSong(songName: string, artistName: string, albumName: string) {
    const url = "http://localhost:5000/download";
    const payload = {
        song_name: songName,
        artist_name: artistName,
        album_name: albumName || ""
    };

    console.log("Downloading song:", songName, artistName, albumName);

    try {
        console.log("Sending request to", url);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        console.log("Response received:", response);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        console.log("Downloading blob");
        const blob = await response.blob();
				const audioURL = URL.createObjectURL(blob);

        return { success: true, audioURL };
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error downloading song:", error);
            return { success: false, message: error.message };
        }
    }
}