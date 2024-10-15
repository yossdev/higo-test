"use client";

import { AvatarIcon } from "@radix-ui/react-icons";
import { Backpack, Clock } from "lucide-react";

export function SummaryStatistics({ data }) {
  return (
    <div className="grid grid-cols-3 gap-5 my-5 h-fit">
      {Object.keys(data).map((v) => (
        <div key={v} className="p-5 border shadow-sm rounded">
          <h1 className="font-semibold text-gray-500 text-lg mb-3">
            {(() => {
              if (v.charAt(0) === "m") {
                return `Avg ${v.slice(4, v.length)}`;
              } else {
                return `Total ${v.slice(5, v.length)}`;
              }
            })()}
          </h1>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold ms-5">{data[v]}</span>
            {v.slice(5, v.length) === "Customers" && (
              <AvatarIcon width={70} height={70} />
            )}
            {v.slice(5, v.length) === "Professions" && (
              <Backpack width={70} height={70} />
            )}
            {v.slice(4, v.length) === "Age" && <Clock width={70} height={70} />}
          </div>
        </div>
      ))}
    </div>
  );
}
