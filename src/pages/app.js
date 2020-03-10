import React, { useEffect, useState } from "react";
import Fuse from 'fuse.js';
import { getAccessToken, playTrack, pause } from "../spotify/auth/api";
import { getRandomNumber, loadSpotifySDK } from "../spotify/helpers";
import { tracks } from "../spotify/playback/constants";
import { useSpeechToText } from "../speechRecognition/useSpeechToText";

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
        console.log("player_state_changed: " + JSON.stringify(state));
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
        console.log("Ready with Device ID", device_id);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      // Connect to the player!
      player.connect();
    };

    setTimeout(() => {
      loadSpotifySDK();
    }, 100)
  }, []);

  const [track, setTrack] = useState();

  const handlePlay = () => {
    const rand = getRandomNumber(tracks.length);
    setTrack(tracks[rand]);
  };

  const [currentSpeechStatus, sendSpeech] = useSpeechToText();

  useEffect(() => {
    if (track) {
      playTrack(deviceId, track.track).then(() => {
        setTimeout(() => {
          pause(deviceId);
          sendSpeech('start');
        }, 8000);
      });
    }
  }, [deviceId, sendSpeech, track]);

  useEffect(() => {
    if (currentSpeechStatus.matches({ supported: 'result' })) {
      const transcript = currentSpeechStatus.context.transcript;
      const options = {
        keys: ['name', 'artist'],
      }
      const fuse = new Fuse(tracks, options);

      console.log(transcript);

      const result = fuse.search(transcript);

      if (result.length > 0 && result[0].track === track.track) {
        setStatus("win");
      } else {
        setStatus("lost");
      }

      setTimeout(() => {
        setStatus("idle");
        handlePlay();
      }, 3000);
    }
  }, [currentSpeechStatus, track]);

  const [status, setStatus] = useState("idle");

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
      <section>
        {status}
      </section>
      <section>
        Speech: {currentSpeechStatus.toStrings().join(' ')}
      </section>
    </div>
  );
};
