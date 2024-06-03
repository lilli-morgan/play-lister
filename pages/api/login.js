export default (req, res) => {
  const scope = "user-read-private user-read-email";
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
  }).toString();

  res.redirect(authUrl.toString());
};
