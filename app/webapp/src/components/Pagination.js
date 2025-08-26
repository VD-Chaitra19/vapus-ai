"use client";
import React from "react";

function buildTiles(totalPages, currentPage) {
  const p = Math.min(Math.max(1, currentPage), totalPages);
  let start = p - 2;
  let end = p + 1;

  if (start < 2) {
    end += 2 - start;
    start = 2;
  }
  if (end > totalPages - 1) {
    const overshoot = end - (totalPages - 1);
    start = Math.max(2, start - overshoot);
    end = totalPages - 1;
  }

  const tiles = [];
  tiles.push({ type: "page", value: 1 });
  if (start > 2) tiles.push({ type: "ellipsis", value: "left" });
  for (let i = start; i <= end; i++) tiles.push({ type: "page", value: i });
  if (end < totalPages - 1) tiles.push({ type: "ellipsis", value: "right" });
  if (totalPages > 1) tiles.push({ type: "page", value: totalPages });
  return tiles;
}

export default function Pagination({ totalPages, currentPage, onChange, className = "" }) {
  const tiles = buildTiles(totalPages, currentPage);
  const go = (n) => {
    const next = Math.min(Math.max(1, n), totalPages);
    if (next !== currentPage) onChange(next);
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <button
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-xl border disabled:opacity-40"
        aria-label="Back"
      >
        ‹ Back
      </button>

      <div className="flex items-center gap-2">
        {tiles.map((t, idx) =>
          t.type === "page" ? (
            <button
              key={`p-${t.value}-${idx}`}
              onClick={() => go(t.value)}
              className={[
                "w-10 h-10 rounded-xl border flex items-center justify-center",
                t.value === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100",
              ].join(" ")}
              aria-current={t.value === currentPage ? "page" : undefined}
              aria-label={`Page ${t.value}`}
            >
              {t.value}
            </button>
          ) : (
            <button
              key={`e-${t.value}-${idx}`}
              onClick={() => go(currentPage + (t.value === "right" ? 2 : -2))}
              className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-gray-100"
              aria-label={t.value === "right" ? "Next pages" : "Previous pages"}
              title={t.value === "right" ? "Jump +2" : "Jump -2"}
            >
              …
            </button>
          )
        )}
      </div>

      <button
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-xl border disabled:opacity-40"
        aria-label="Next"
      >
        Next ›
      </button>
    </div>
  );
}
