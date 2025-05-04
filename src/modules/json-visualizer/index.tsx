/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RotateCcw, Download, Upload } from "lucide-react";
import JsonTree from "./components/JsonTree";
import JsonEditor from "./components/JsonEditor";

const JsonVisualizer: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const parseJson = () => {
    try {
      if (!jsonInput.trim()) {
        setParsedJson(null);
        setError(null);
        return;
      }

      const parsed = JSON.parse(jsonInput);
      setParsedJson(parsed);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setParsedJson(null);
    }
  };

  const formatJson = () => {
    try {
      if (!jsonInput.trim()) return;

      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      setParsedJson(parsed);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const minifyJson = () => {
    try {
      if (!jsonInput.trim()) return;

      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonInput(minified);
      setParsedJson(parsed);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const clearJson = () => {
    setJsonInput("");
    setParsedJson(null);
    setError(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    if (!jsonInput) return;

    const blob = new Blob([jsonInput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      try {
        setParsedJson(JSON.parse(content));
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        setParsedJson(null);
      }
    };
    reader.readAsText(file);

    // Reset the input value so the same file can be uploaded again
    e.target.value = "";
  };

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <h1 className='text-2xl font-bold'>JSON Visualizer</h1>

      <Card>
        <CardHeader>
          <CardTitle>JSON Input</CardTitle>
          <CardDescription>Enter or paste your JSON data</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Textarea
            placeholder='Enter JSON here...'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className='min-h-[200px] font-mono'
          />

          <div className='flex flex-wrap gap-2'>
            <Button onClick={parseJson}>Parse JSON</Button>
            <Button variant='outline' onClick={formatJson}>
              Format
            </Button>
            <Button variant='outline' onClick={minifyJson}>
              Minify
            </Button>
            <Button variant='outline' onClick={clearJson}>
              <RotateCcw className='h-4 w-4 mr-2' />
              Clear
            </Button>
            <Button variant='outline' onClick={copyToClipboard}>
              <Copy className='h-4 w-4 mr-2' />
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant='outline' onClick={downloadJson}>
              <Download className='h-4 w-4 mr-2' />
              Download
            </Button>
            <div className='relative'>
              <input
                type='file'
                accept='.json'
                onChange={handleFileUpload}
                className='absolute inset-0 opacity-0 cursor-pointer'
              />
              <Button variant='outline'>
                <Upload className='h-4 w-4 mr-2' />
                Upload
              </Button>
            </div>
          </div>

          {error && (
            <div className='p-4 border border-red-300 bg-red-50 text-red-800 rounded-md'>
              <p className='font-semibold'>Error:</p>
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {parsedJson && (
        <Card>
          <CardHeader>
            <CardTitle>JSON Visualization</CardTitle>
            <CardDescription>Interactive view of your JSON data</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='tree'>
              <TabsList>
                <TabsTrigger value='tree'>Tree View</TabsTrigger>
                <TabsTrigger value='editor'>Editor View</TabsTrigger>
              </TabsList>

              <TabsContent value='tree'>
                <div className='border rounded-md p-4 bg-muted/30 max-h-[500px] overflow-auto'>
                  <JsonTree data={parsedJson} />
                </div>
              </TabsContent>

              <TabsContent value='editor'>
                <JsonEditor
                  data={parsedJson}
                  onChange={(newJson) => {
                    setJsonInput(JSON.stringify(newJson, null, 2));
                    setParsedJson(newJson);
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JsonVisualizer;
