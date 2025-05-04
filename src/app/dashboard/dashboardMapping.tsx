import React from "react";
// import ToolsLayout from "@/Layout/ToolsLayout";

// Import your components here
// Example: import JsonFormatter from '@/modules/json-formatter';
// Example: import RegexTester from '@/modules/regex-tester';
// Example: import TodoList from '@/modules/todo-list';

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
  // Example mappings:
  "json-formatter": {
    component: () => <div>JSON Formatter Component</div>, // Replace with actual component
    title: "JSON Formatter",
    description: "Format and validate JSON data",
  },
  "regex-tester": {
    component: () => <div>Regex Tester Component</div>, // Replace with actual component
    title: "Regex Tester",
    description: "Test and debug regular expressions",
  },
  "todo-list": {
    component: () => <div>Todo List Component</div>, // Replace with actual component
    title: "Todo List",
    description: "Manage your tasks and to-dos",
  },
  // Add more tools as needed
};

// Helper function to get a component by slug
export const getComponentBySlug = (slug: string) => {
  return dashboardComponents[slug] || null;
};
