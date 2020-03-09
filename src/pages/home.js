import React from "react";
import { createAuthUrl } from "../spotify/auth/constants";

export const Home = () => {
  return (
    <>
      <div>Home</div>
      <button onClick={() => window.location.replace(createAuthUrl())}>
        Auth
      </button>
    </>
  );
};
