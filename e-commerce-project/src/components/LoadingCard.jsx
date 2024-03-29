import React from "react";

export default function LoadingCard() {
  return (
    <div className="flex h-auto w-[200px] flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <div className="h-4 w-full rounded-lg bg-[#E3F2C1]/40"></div>
      <div className="h-4 w-[80%] rounded-lg bg-[#E3F2C1]/40"></div>
    </div>
  );
}
