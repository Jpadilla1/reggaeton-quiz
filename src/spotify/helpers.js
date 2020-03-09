export const getRandomNumber = upTo => Math.floor(Math.random() * upTo);
export const getRandomNumberExcluding = (indexesToExclude, upTo) => {
  const n = getRandomNumber(upTo);

  if (indexesToExclude.includes(n)) {
    return getRandomNumberExcluding(indexesToExclude, upTo);
  }
  return n;
};

export const loadSpotifySDK = callback => {
  const existingScript = document.getElementById("scriptId");

  if (!existingScript) {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js"; // URL for the third-party library being loaded.
    script.id = "Spotify"; // e.g., googleMaps or stripe
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};
