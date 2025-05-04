"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface ResponseViewerProps {
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
  };
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJson = (data: any): string => {
    try {
      if (typeof data === "string") {
        // Try to parse if it's a JSON string
        return JSON.stringify(JSON.parse(data), null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch (e) {
      // If it's not valid JSON, return as is
      console.error("Error formatting JSON:", e);
      return typeof data === "string" ? data : JSON.stringify(data);
    }
  };

  const formattedData = formatJson(response.data);

  return (
    <div className='border rounded-md p-4 mt-4'>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <span
            className={`px-2 py-1 rounded text-sm font-medium ${
              response.status >= 200 && response.status < 300
                ? "bg-green-100 text-green-800"
                : response.status >= 400
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {response.status} {response.statusText}
          </span>
        </div>
        <Button variant='outline' size='sm' onClick={() => copyToClipboard(formattedData)}>
          <Copy className='h-4 w-4 mr-2' />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      <Tabs defaultValue='body'>
        <TabsList>
          <TabsTrigger value='body'>Body</TabsTrigger>
          <TabsTrigger value='headers'>Headers</TabsTrigger>
        </TabsList>

        <TabsContent value='body'>
          <pre className='bg-gray-100 p-4 rounded overflow-auto max-h-[400px] text-sm'>{formattedData}</pre>
        </TabsContent>

        <TabsContent value='headers'>
          <div className='bg-gray-100 p-4 rounded overflow-auto max-h-[400px]'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-2 px-4'>Name</th>
                  <th className='text-left py-2 px-4'>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response.headers).map(([key, value]) => (
                  <tr key={key} className='border-b'>
                    <td className='py-2 px-4 font-medium'>{key}</td>
                    <td className='py-2 px-4'>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseViewer;
