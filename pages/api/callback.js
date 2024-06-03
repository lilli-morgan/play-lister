import axios from "axios";

export default async (req, res) => {
  const code = req.query.code || null;
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

  const tokenUrl = "https://accounts.spotify.com/api/token";

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    // Store tokens in cookies or session
    res.redirect(
      `/?access_token=${access_token}&refresh_token=${refresh_token}`
    );
  } catch (error) {
    res.redirect("/?error=invalid_token");
  }
};
