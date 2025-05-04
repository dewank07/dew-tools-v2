import ToolsLayout from "@/Layout/ToolsLayout";
import Link from "next/link";
import { dashboardComponents } from "./dashboardMapping";

export default function Page() {
  return (
    <ToolsLayout>
      <div className='container mx-auto py-8'>
        <h1 className='text-3xl font-bold mb-8'>Dashboard</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Object.entries(dashboardComponents).map(([slug, { title, description }]) => (
            <Link
              key={slug}
              href={`/dashboard/${slug}`}
              className='block p-6 rounded-lg border border-border hover:border-primary/50 transition-colors'
            >
              <h2 className='text-xl font-semibold mb-2'>{title}</h2>
              {description && <p className='text-muted-foreground'>{description}</p>}
            </Link>
          ))}
        </div>
      </div>
    </ToolsLayout>
  );
}
