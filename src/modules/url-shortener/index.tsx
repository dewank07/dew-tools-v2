"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<{ original: string; shortened: string }[]>([]);

  const shortenUrl = async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      // Validate URL
      if (!url.match(/^(http|https):\/\/[^ "]+$/)) {
        throw new Error("Please enter a valid URL including http:// or https://");
      }

      // Using TinyURL API for demonstration
      // In a real app, you might want to use your own backend or a different service
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const shortened = await response.text();
      setShortUrl(shortened);

      // Add to history
      setHistory([{ original: url, shortened }, ...history.slice(0, 9)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <h1 className='text-2xl font-bold'>URL Shortener</h1>

      <Card>
        <CardHeader>
          <CardTitle>Shorten Your URL</CardTitle>
          <CardDescription>Enter a long URL to create a shorter, more manageable link</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex space-x-2'>
              <Input
                placeholder='Enter URL (e.g., https://example.com/very/long/url)'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className='flex-1'
              />
              <Button onClick={shortenUrl} disabled={loading || !url}>
                {loading ? "Shortening..." : "Shorten"}
              </Button>
            </div>

            {error && (
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {shortUrl && (
              <div className='bg-gray-100 p-4 rounded-md'>
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>{shortUrl}</span>
                  <Button variant='outline' size='sm' onClick={() => copyToClipboard(shortUrl)}>
                    {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                    <span className='ml-2'>{copied ? "Copied!" : "Copy"}</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {history.map((item, index) => (
                <div key={index} className='flex justify-between items-center p-2 border-b'>
                  <div className='flex-1 truncate'>
                    <div className='text-sm text-gray-500 truncate'>{item.original}</div>
                    <div className='font-medium'>{item.shortened}</div>
                  </div>
                  <Button variant='ghost' size='sm' onClick={() => copyToClipboard(item.shortened)}>
                    <Copy className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UrlShortener;
