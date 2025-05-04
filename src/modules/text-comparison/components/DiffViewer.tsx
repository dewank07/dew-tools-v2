/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { diffLines, diffWords } from "diff";

interface DiffViewerProps {
  text1: string;
  text2: string;
  viewType: "side-by-side" | "inline";
}

const DiffViewer: React.FC<DiffViewerProps> = ({ text1, text2, viewType }) => {
  const [lineDiff, setLineDiff] = useState<any[]>([]);
  const [wordDiff, setWordDiff] = useState<any[]>([]);

  useEffect(() => {
    // Calculate line differences
    const lineChanges = diffLines(text1, text2);
    setLineDiff(lineChanges);

    // Calculate word differences
    const wordChanges = diffWords(text1, text2);
    setWordDiff(wordChanges);
  }, [text1, text2]);

  if (viewType === "side-by-side") {
    return (
      <div className='grid grid-cols-2 gap-4'>
        <div className='border rounded-md p-4 bg-muted/30'>
          {lineDiff.map((part, index) => (
            <div
              key={index}
              className={`${part.added ? "hidden" : part.removed ? "bg-red-100 dark:bg-red-900/20" : ""}`}
            >
              {part.value.split("\n").map((line: string, i: number) =>
                line || i < part.value.split("\n").length - 1 ? (
                  <div key={i} className='whitespace-pre-wrap'>
                    {line}
                  </div>
                ) : null,
              )}
            </div>
          ))}
        </div>
        <div className='border rounded-md p-4 bg-muted/30'>
          {lineDiff.map((part, index) => (
            <div
              key={index}
              className={`${part.removed ? "hidden" : part.added ? "bg-green-100 dark:bg-green-900/20" : ""}`}
            >
              {part.value.split("\n").map((line: string, i: number) =>
                line || i < part.value.split("\n").length - 1 ? (
                  <div key={i} className='whitespace-pre-wrap'>
                    {line}
                  </div>
                ) : null,
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='border rounded-md p-4 bg-muted/30'>
      {wordDiff.map((part, index) => (
        <span
          key={index}
          className={`${
            part.added ? "bg-green-100 dark:bg-green-900/20" : part.removed ? "bg-red-100 dark:bg-red-900/20" : ""
          }`}
        >
          {part.value}
        </span>
      ))}
    </div>
  );
};

export default DiffViewer;
