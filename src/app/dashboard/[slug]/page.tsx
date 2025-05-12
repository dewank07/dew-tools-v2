import React from "react";
import { notFound } from "next/navigation";
import ToolsLayout from "@/Layout/ToolsLayout";
import { getComponentBySlug } from "../dashboardMapping";

type Params = Promise<{ slug: string }>;

// Dynamic page component
export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const componentData = getComponentBySlug(slug);

  if (!componentData) {
    notFound();
  }

  const { component: Component } = componentData;

  return (
    <ToolsLayout>
      <div className='container mx-auto py-6'>
        <Component />
      </div>
    </ToolsLayout>
  );
}
