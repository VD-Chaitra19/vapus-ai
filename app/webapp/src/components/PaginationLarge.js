"use client";
import React from "react";

export default function PaginationLarge({
  totalPages,
  currentPage,
  onChange,
  className = "",
  labels = { first: "« First", back: "< Back", next: "Next >", last: "Last »", go: "Click", page: "Page" },
}) {
  const clamp = (n) => Math.min(Math.max(1, n), Math.max(1, totalPages));
  const go = (n) => {
    const c = clamp(n);
    if (c !== currentPage) onChange(c);
  };

  const [input, setInput] = React.useState(String(currentPage));
  React.useEffect(() => setInput(String(currentPage)), [currentPage]);

  const submit = () => {
    const n = parseInt(input, 10);
    if (!Number.isNaN(n)) go(n);
  };

  const btnBase =
    "px-3 py-1.5 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button className={btnBase} onClick={() => go(1)} disabled={currentPage === 1}>
        {labels.first}
      </button>
      <button className={btnBase} onClick={() => go(currentPage - 1)} disabled={currentPage === 1}>
        {labels.back}
      </button>

      <button className={btnBase} onClick={() => go(currentPage + 1)} disabled={currentPage === totalPages}>
        {labels.next}
      </button>
      <button className={btnBase} onClick={() => go(totalPages)} disabled={currentPage === totalPages}>
        {labels.last}
      </button>

      <div className="ml-4 flex items-center gap-2">
        <span className="text-sm text-gray-700">{labels.page}</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^\d]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-16 px-2 py-1.5 border rounded text-center"
          inputMode="numeric"
          aria-label="Page number"
        />
        <button className={btnBase} onClick={submit}>
          {labels.go}
        </button>
      </div>
    </div>
  );
}
