/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface JsonEditorProps {
  data: any;
  onChange: (data: any) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ data, onChange }) => {
  const [jsonText, setJsonText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setJsonText(JSON.stringify(data, null, 2));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJsonText(newText);

    try {
      if (newText.trim()) {
        const parsed = JSON.parse(newText);
        onChange(parsed);
        setError(null);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className='space-y-2'>
      <Textarea value={jsonText} onChange={handleChange} className='min-h-[400px] font-mono' />

      {error && <div className='p-2 text-sm text-red-600'>{error}</div>}
    </div>
  );
};

export default JsonEditor;
