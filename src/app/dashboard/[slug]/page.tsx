import React from "react";
import { notFound } from "next/navigation";
import ToolsLayout from "@/Layout/ToolsLayout";
import { getComponentBySlug } from "../dashboardMapping";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
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
