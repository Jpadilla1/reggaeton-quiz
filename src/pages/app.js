import React, { useEffect, useState } from "react";
import { getAccessToken, playTrack, pause } from "../spotify/auth/api";
import { getRandomNumber, getRandomNumberExcluding } from "../spotify/helpers";

const tracks = [
  {
    name: "Yo Perreo Sola",
    track: "0SqqAgdovOE24BzxIClpjw",
    artist: "Bad Bunny",
    releaseYear: "2020"
  },
  {
    name: "Sexy Movimiento",
    track: "3s3Pl2G1PJ2h1937qXP1iU",
    artist: "Wisin Y Yandel",
    releaseYear: "2007"
  },
  {
    name: "Salió el Sol",
    track: "73t9xPdspe86hSxEtw7ZK6",
    artist: "Don Omar",
    releaseYear: "2006"
  },
  {
    name: "Gasolina",
    track: "6jEZLz3YpnEBRpVkv35AmP",
    artist: "Daddy Yankee",
    releaseYear: "2004"
  },
  {
    name: "El Tiburón",
    track: "7xzcR7ChznJF5KgDS7exYA",
    artist: "Alexis y Fido",
    releaseYear: "2006"
  },
  {
    name: "Agarrale el Pantalon",
    track: "3Wd4Yl2TjjTxkvlJCHWvB9",
    artist: "Alexis y Fido",
    releaseYear: "2005"
  },
  {
    name: "Hasta el amanecer",
    track: "5Fim1gaXBgsiFfsQAfQSDS",
    artist: "Nicky Jam",
    releaseYear: "2017"
  },
  {
    name: "5 letras",
    track: "0tDSgSmZsbxCkdkfUPjg59",
    artist: "Alexis y Fido",
    releaseYear: "2007"
  },
  {
    name: "Andas en mi cabeza",
    track: "5NS0854TqZQVoRmJKSWtFZ",
    artist: "Chino y Nacho",
    releaseYear: "2016"
  },
  {
    name: "Yo Quiero Bailar",
    track: "3sfJP7ZoNwFpAxnjlzXwVL",
    artist: "Ivy Queen",
    releaseYear: "2003"
  }
];

export const App = () => {
  const [deviceId, setDeviceId] = useState();

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = getAccessToken();
      const player = new window.Spotify.Player({
        name: "My Player",
        getOAuthToken: cb => {
          cb(token);
        }
      });

      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("playback_error", ({ message }) => {
        console.error(message);
      });

      // Playback status updates
      player.addListener("player_state_changed", state => {
        console.log(state);
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
        console.log("Ready with Device ID", device_id);
        // playTrack(device_id, yoPerreoSola);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      // Connect to the player!
      player.connect();
    };
  }, []);

  const [track, setTrack] = useState();
  const [options, setOptions] = useState();

  const handlePlay = () => {
    const rand = getRandomNumber(tracks.length);
    setTrack(tracks[rand]);

    const options = [tracks[rand]];

    const id1 = getRandomNumberExcluding([rand], tracks.length);

    options.push(tracks[id1]);

    const id2 = getRandomNumberExcluding([rand, id1], tracks.length);

    options.push(tracks[id2]);

    const id3 = getRandomNumberExcluding([rand, id1, id2], tracks.length);

    options.push(tracks[id3]);

    setOptions(options);
  };

  useEffect(() => {
    if (track) {
      playTrack(deviceId, track.track);
    }
  }, [track]);

  const [status, setStatus] = useState("idle");

  const handleSelection = option => () => {
    if (option.track === track.track) {
      setStatus("win");
    } else {
      setStatus("lost");
    }

    pause(deviceId);

    setTimeout(() => {
      setStatus("idle");
      handlePlay();
    }, 3000);
  };

  return (
    <div>
      <p>Device: {deviceId}</p>
      <button onClick={handlePlay}>Play</button>
      <button
        onClick={() => {
          pause(deviceId);
        }}
      >
        Pause
      </button>
      <div>
        {options &&
          options.map(o => (
            <button
              onClick={handleSelection(o)}
              style={{ width: "150px", height: "100px" }}
            >
              {o.name}
            </button>
          ))}
      </div>
      {status}
    </div>
  );
};
