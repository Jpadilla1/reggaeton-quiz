const scopesArr = [
  "user-read-playback-state",
  "user-read-private",
  "playlist-read-private",
  "user-library-modify",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "user-follow-modify",
  "user-modify-playback-state",
  "user-read-email",
  "user-library-read",
  "user-top-read",
  "playlist-modify-public",
  "user-follow-read",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-library-read",
  "app-remote-control",
  "streaming"
];
const scopes = scopesArr.join(" ");

export const createAuthUrl = (clientId, redirectUrl) =>
  "https://accounts.spotify.com/authorize" +
  "?response_type=code" +
  "&client_id=" +
  "208eafa3c9ae45f9bb8a42e3a4dbf40c" +
  (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
  "&redirect_uri=" +
  encodeURIComponent("http://localhost:3000/auth_callback");
