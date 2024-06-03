import PlaylistLayout from "@/components/PlaylistLayout";
import SearchMusic from "@/components/SearchMusic";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <div>
      <SearchMusic />
      <LoginButton />
      <PlaylistLayout />
    </div>
  );
}
