/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

interface JsonTreeProps {
  data: any;
  level?: number;
}

const JsonTree: React.FC<JsonTreeProps> = ({ data, level = 0 }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderValue = (value: any, key: string) => {
    if (value === null) {
      return <span className='text-gray-500'>null</span>;
    }

    if (typeof value === "boolean") {
      return <span className='text-purple-600'>{value.toString()}</span>;
    }

    if (typeof value === "number") {
      return <span className='text-blue-600'>{value}</span>;
    }

    if (typeof value === "string") {
      return <span className='text-green-600'>&quot;{value}&quot;</span>;
    }

    if (Array.isArray(value)) {
      return renderArray(value, key);
    }

    if (typeof value === "object") {
      return renderObject(value, key);
    }

    return <span>{String(value)}</span>;
  };

  const renderObject = (obj: Record<string, any>, parentKey: string) => {
    const keys = Object.keys(obj);
    const isExpanded = expanded[parentKey];

    return (
      <div>
        <div className='flex items-center cursor-pointer' onClick={() => toggleExpand(parentKey)}>
          {isExpanded ? <ChevronDown className='h-4 w-4 mr-1' /> : <ChevronRight className='h-4 w-4 mr-1' />}
          <span className='text-gray-700'>{"{"}</span>
          {!isExpanded && (
            <span className='text-gray-500 ml-1'>
              {keys.length} {keys.length === 1 ? "property" : "properties"}
            </span>
          )}
          {!isExpanded && <span className='text-gray-700 ml-1'>{"}"}</span>}
        </div>

        {isExpanded && (
          <div className='ml-4 border-l-2 border-gray-200 pl-2'>
            {keys.map((key) => (
              <div key={key} className='my-1'>
                <span className='text-red-600'>&quot;{key}&quot;</span>
                <span className='text-gray-700'>: </span>
                {renderValue(obj[key], `${parentKey}.${key}`)}
                {key !== keys[keys.length - 1] && <span className='text-gray-700'>,</span>}
              </div>
            ))}
            <div className='text-gray-700'>{"}"}</div>
          </div>
        )}
      </div>
    );
  };

  const renderArray = (arr: any[], parentKey: string) => {
    const isExpanded = expanded[parentKey];

    return (
      <div>
        <div className='flex items-center cursor-pointer' onClick={() => toggleExpand(parentKey)}>
          {isExpanded ? <ChevronDown className='h-4 w-4 mr-1' /> : <ChevronRight className='h-4 w-4 mr-1' />}
          <span className='text-gray-700'>{"["}</span>
          {!isExpanded && (
            <span className='text-gray-500 ml-1'>
              {arr.length} {arr.length === 1 ? "item" : "items"}
            </span>
          )}
          {!isExpanded && <span className='text-gray-700 ml-1'>{"]"}</span>}
        </div>

        {isExpanded && (
          <div className='ml-4 border-l-2 border-gray-200 pl-2'>
            {arr.map((item, index) => (
              <div key={index} className='my-1'>
                {renderValue(item, `${parentKey}[${index}]`)}
                {index !== arr.length - 1 && <span className='text-gray-700'>,</span>}
              </div>
            ))}
            <div className='text-gray-700'>{"]"}</div>
          </div>
        )}
      </div>
    );
  };

  return renderValue(data, "root");
};

export default JsonTree;
