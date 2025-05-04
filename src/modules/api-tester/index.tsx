"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import RequestHeaders from "./components/RequestHeaders";
import RequestParams from "./components/RequestParams";
import ResponseViewer from "./components/ResponseViewer";

const ApiTester: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<string>("GET");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [params, setParams] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState<string>("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare headers
      const headerObj: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key.trim() !== "") {
          headerObj[h.key] = h.value;
        }
      });

      // Prepare URL with query params
      let finalUrl = url;
      if (params.length > 0 && params[0].key.trim() !== "") {
        const queryString = params
          .filter((p) => p.key.trim() !== "")
          .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
          .join("&");

        finalUrl += finalUrl.includes("?") ? `&${queryString}` : `?${queryString}`;
      }

      // Prepare request options
      const options: RequestInit = {
        method,
        headers: headerObj,
      };

      // Add body for non-GET requests
      if (method !== "GET" && body.trim() !== "") {
        options.body = body;
      }

      // Make the request
      const res = await fetch(finalUrl, options);

      // Parse response
      let responseData;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: responseData,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto p-4 space-y-4'>
      <h1 className='text-2xl font-bold'>API Tester</h1>

      <div className='flex space-x-2'>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className='w-[100px]'>
            <SelectValue placeholder='Method' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='GET'>GET</SelectItem>
            <SelectItem value='POST'>POST</SelectItem>
            <SelectItem value='PUT'>PUT</SelectItem>
            <SelectItem value='DELETE'>DELETE</SelectItem>
            <SelectItem value='PATCH'>PATCH</SelectItem>
            <SelectItem value='HEAD'>HEAD</SelectItem>
            <SelectItem value='OPTIONS'>OPTIONS</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder='Enter URL' value={url} onChange={(e) => setUrl(e.target.value)} className='flex-1' />

        <Button onClick={handleSendRequest} disabled={loading || !url}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>

      <Tabs defaultValue='params'>
        <TabsList>
          <TabsTrigger value='params'>Params</TabsTrigger>
          <TabsTrigger value='headers'>Headers</TabsTrigger>
          <TabsTrigger value='body'>Body</TabsTrigger>
        </TabsList>

        <TabsContent value='params'>
          <RequestParams params={params} setParams={setParams} />
        </TabsContent>

        <TabsContent value='headers'>
          <RequestHeaders headers={headers} setHeaders={setHeaders} />
        </TabsContent>

        <TabsContent value='body'>
          <Textarea
            placeholder='Request body (JSON, text, etc.)'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className='min-h-[200px]'
          />
        </TabsContent>
      </Tabs>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          <p>{error}</p>
        </div>
      )}

      {response && <ResponseViewer response={response} />}
    </div>
  );
};

export default ApiTester;
