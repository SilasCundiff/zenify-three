"use client";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      className="bg-[#18D860] text-black px-4 py-3 font-semibold  rounded-full w-48 mb-2 mr-3"
      onClick={() => signIn("spotify", { callbackUrl: "/" })}
    >
      Login with Spotify
    </button>
  );
}
