import { useState, useEffect } from "react";
import axios from "axios";

const SearchMusic = () => {
  const [musicSearch, setMusicSearch] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  // Extract access token from URL query parameters:
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      alert("You need to log in first!");
      return;
    }

    try {
      // Fetch the searched artist using search endpoint:
      const artistResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${musicSearch}&type=artist`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Extract artist id of first artist in search result:
      const artistId = artistResponse.data.artists.items[0].id;

      // Fetch related artists (using artist id):
      const relatedArtistsResponse = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // An array of related artists:
      const relatedArtists = relatedArtistsResponse.data.artists;

      // Iterate through each related artist and get top tracks:
      const trackPromises = relatedArtists.map(async (artist) => {
        const tracksResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Use just 2 tracks per artist:
        return tracksResponse.data.tracks.slice(0, 2);
      });

      // Wait for promises to resolve - array of arrays (related artists, inner array is 2 tracks from each):
      const tracksArrays = await Promise.all(trackPromises);

      // Flatten into a single array of tracks:
      const allTracks = tracksArrays.flat();

      // Shuffle allTracks array using shuffleArray function:
      const shuffledTracks = shuffleArray(allTracks);

      // Update playlist state:
      setPlaylist(shuffledTracks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-lg w-full max-w-xs"
          value={musicSearch}
          onChange={(e) => setMusicSearch(e.target.value)}
        />
        <button className="btn-primary btn-wide btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">
          Create a playlist
        </button>
      </form>
      <div>
        {playlist.map((track) => (
          <div key={track.id} className="my-2">
            <p>{track.name}</p>
            <audio controls src={track.preview_url}></audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchMusic;
