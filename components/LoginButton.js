import Link from "next/link";

const LoginButton = () => (
  <Link href="/api/login" className="btn btn-primary">
    Login with Spotify
  </Link>
);

export default LoginButton;
