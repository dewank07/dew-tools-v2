import TimeConverter from "@/modules/time-converter";
import ApiTester from "@/modules/api-tester";
import UrlShortener from "@/modules/url-shortener";
import TextComparison from "@/modules/text-comparison";
import CommitMessageGenerator from "@/modules/commit-message-generator";
import JsonVisualizer from "@/modules/json-visualizer";
import RegexBuilder from "@/modules/regex-builder";

// Define the mapping of slugs to components
interface DashboardComponentMapping {
  [key: string]: {
    component: React.ComponentType;
    title: string;
    description?: string;
  };
}

// Add your components to this mapping
export const dashboardComponents: DashboardComponentMapping = {
  "api-tester": {
    component: ApiTester,
    title: "API Tester",
    description: "Test API endpoints with different HTTP methods",
  },
  "time-converter": {
    component: TimeConverter,
    title: "Time Converter",
    description: "Convert between different time zones and formats",
  },
  "url-shortner": {
    component: UrlShortener, // Replace with actual component
    title: "URL Shortner",
    description: "Shorten long URLs for easier sharing",
  },
  "text-comparison": {
    component: TextComparison,
    title: "Text Comparison",
    description: "Compare two text blocks and highlight differences",
  },
  "commit-message-generator": {
    component: CommitMessageGenerator,
    title: "Commit Message Generator",
    description: "Generate standardized git commit messages",
  },
  "json-visualizer": {
    component: JsonVisualizer,
    title: "JSON Visualizer",
    description: "Visualize, format and validate JSON data",
  },
  "regex-builder": {
    component: RegexBuilder,
    title: "Regex Builder",
    description: "Build and test regular expressions with live preview",
  },
};

// Helper function to get a component by slug
export const getComponentBySlug = (slug: string) => {
  return dashboardComponents[slug] || null;
};
