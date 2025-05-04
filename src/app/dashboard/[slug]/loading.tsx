import React from "react";
import ToolsLayout from "@/Layout/ToolsLayout";

export default function Loading() {
  return (
    <ToolsLayout>
      <div className='container mx-auto py-6'>
        <div className='h-8 w-48 bg-muted/60 rounded-md mb-6 animate-pulse'></div>
        <div className='space-y-4'>
          <div className='h-24 bg-muted/60 rounded-md animate-pulse'></div>
          <div className='h-32 bg-muted/60 rounded-md animate-pulse'></div>
          <div className='h-24 bg-muted/60 rounded-md animate-pulse'></div>
        </div>
      </div>
    </ToolsLayout>
  );
}
