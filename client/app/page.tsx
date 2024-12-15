"use client";

import React from "react";
import StatusBoard from "./components/status-board";

export default function Home() {
  return (
    <div className="mx-auto h-full max-w-screen-2xl overflow-hidden p-4">
      <h1 className="mb-4 text-2xl font-bold">Task Status Board</h1>
      <StatusBoard />
    </div>
  );
}
