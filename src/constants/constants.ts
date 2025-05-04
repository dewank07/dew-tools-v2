import { Frame, LifeBuoy, Map, PieChart, Send } from "lucide-react";
export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "JSON-Formatter",
      url: "/dashboard/json-formatter",
      icon: Frame,
    },
    {
      name: "Regex Tester",
      url: "/dashboard/regex-tester",
      icon: PieChart,
    },
    {
      name: "Todo List",
      url: "/dashboard/todo-list",
      icon: Map,
    },
  ],
};
