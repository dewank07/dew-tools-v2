import React from "react";
import Link from "next/link";
import ToolsLayout from "@/Layout/ToolsLayout";

export default function NotFound() {
  return (
    <ToolsLayout>
      <div className='container mx-auto py-12 text-center'>
        <h2 className='text-3xl font-bold mb-4'>Tool Not Found</h2>
        <p className='mb-6 text-muted-foreground'>
          The tool you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link href='/dashboard' className='rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90'>
          Return to Dashboard
        </Link>
      </div>
    </ToolsLayout>
  );
}
