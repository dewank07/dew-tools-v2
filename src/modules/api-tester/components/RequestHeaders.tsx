import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from 'lucide-react';

interface RequestHeadersProps {
  headers: { key: string; value: string }[];
  setHeaders: React.Dispatch<React.SetStateAction<{ key: string; value: string }[]>>;
}

const RequestHeaders: React.FC<RequestHeadersProps> = ({ headers, setHeaders }) => {
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  return (
    <div className="space-y-2">
      {headers.map((header, index) => (
        <div key={index} className="flex space-x-2">
          <Input
            placeholder="Header name"
            value={header.key}
            onChange={(e) => updateHeader(index, 'key', e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={header.value}
            onChange={(e) => updateHeader(index, 'value', e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => removeHeader(index)}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addHeader} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Header
      </Button>
    </div>
  );
};

export default RequestHeaders;