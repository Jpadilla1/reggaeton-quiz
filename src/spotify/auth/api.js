export const getAccessToken = () =>
  JSON.parse(sessionStorage.getItem("auth")).access_token;

export const playTrack = (device, trackId, position_ms = 0) => {
  return fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${device}`,
    {
      method: "PUT",
      body: JSON.stringify({
        uris: [`spotify:track:${trackId}`],
        position_ms
      }),
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }
  );
};

export const pause = device => {
  return fetch(
    `https://api.spotify.com/v1/me/player/pause?device_id=${device}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }
  );
};
