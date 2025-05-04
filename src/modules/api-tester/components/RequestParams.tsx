import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from 'lucide-react';

interface RequestParamsProps {
  params: { key: string; value: string }[];
  setParams: React.Dispatch<React.SetStateAction<{ key: string; value: string }[]>>;
}

const RequestParams: React.FC<RequestParamsProps> = ({ params, setParams }) => {
  const addParam = () => {
    setParams([...params, { key: '', value: '' }]);
  };

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index));
  };

  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  return (
    <div className="space-y-2">
      {params.map((param, index) => (
        <div key={index} className="flex space-x-2">
          <Input
            placeholder="Parameter name"
            value={param.key}
            onChange={(e) => updateParam(index, 'key', e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={param.value}
            onChange={(e) => updateParam(index, 'value', e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => removeParam(index)}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addParam} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Parameter
      </Button>
    </div>
  );
};

export default RequestParams;