"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw } from "lucide-react";
import DiffViewer from "./components/DiffViewer";

const TextComparison: React.FC = () => {
  const [text1, setText1] = useState<string>("");
  const [text2, setText2] = useState<string>("");
  const [diffView, setDiffView] = useState<"side-by-side" | "inline">("side-by-side");

  const handleClear = () => {
    setText1("");
    setText2("");
  };

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <h1 className='text-2xl font-bold'>Text Comparison Tool</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Original Text</CardTitle>
            <CardDescription>Enter or paste the original text</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='Enter original text here...'
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className='min-h-[200px]'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modified Text</CardTitle>
            <CardDescription>Enter or paste the modified text</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='Enter modified text here...'
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className='min-h-[200px]'
            />
          </CardContent>
        </Card>
      </div>

      <div className='flex justify-between items-center'>
        <div className='space-x-2'>
          <Button variant='outline' onClick={handleClear}>
            <RotateCcw className='h-4 w-4 mr-2' />
            Clear All
          </Button>
        </div>

        <div className='space-x-2'>
          <Button
            variant='outline'
            onClick={() => setDiffView("side-by-side")}
            className={diffView === "side-by-side" ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""}
          >
            Side by Side
          </Button>
          <Button
            variant='outline'
            onClick={() => setDiffView("inline")}
            className={diffView === "inline" ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""}
          >
            Inline
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Differences</CardTitle>
          <CardDescription>Highlighted differences between the texts</CardDescription>
        </CardHeader>
        <CardContent>
          {text1 || text2 ? (
            <DiffViewer text1={text1} text2={text2} viewType={diffView} />
          ) : (
            <div className='text-center text-muted-foreground p-4'>
              Enter text in both fields to see the differences
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TextComparison;
