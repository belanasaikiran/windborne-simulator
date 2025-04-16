"use client";
import dynamic from "next/dynamic";

const BalloonMap = dynamic(() => import("./BalloonMap"), { ssr: false });

export default function Home() {
  return (
    <main>
      <div style={{ height: "100vh" }}>
        <BalloonMap />
      </div>
    </main>
  );
}
