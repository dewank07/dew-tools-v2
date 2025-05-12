import {
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Globe,
  Clock,
  Link2,
  GitCommit,
  FileJson,
  Code,
  GitCompare,
  Sparkles,
  LogOut,
  PlusCircle,
  MessagesSquare,
} from "lucide-react";

export const data = {
  user: {
    name: "Dewank",
    email: "work.dewank@gmail.com",
    avatar: "dino.png",
  },

  navSecondary: [
    {
      title: "Support",
      url: "https://github.com/dewank07/dew-tools-v2",
      icon: LifeBuoy,
    },
    {
      title: "Report a bug",
      url: "https://github.com/dewank07/dew-tools-v2/issues/new",
      icon: Send,
    },
  ],

  // User dropdown menu configuration
  userMenu: {
    premium: [
      {
        title: "Portfolio - Hire me!",
        icon: Sparkles,
        url: "https://dewank.vercel.app/",
      },
    ],
    account: [
      {
        title: "Linkedin",
        icon: MessagesSquare,
        url: "https://www.linkedin.com/in/dewankrastogi/",
      },
      {
        title: "Github",
        icon: Code,
        url: "https://github.com/dewank07",
      },
    ],
    actions: [
      {
        title: "Log out",
        icon: LogOut,
        url: "#",
      },
    ],
  },

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
    {
      name: "API Tester",
      url: "/dashboard/api-tester",
      icon: Globe,
    },
    {
      name: "Time Converter",
      url: "/dashboard/time-converter",
      icon: Clock,
    },
    {
      name: "URL Shortener",
      url: "/dashboard/url-shortner",
      icon: Link2,
    },
    {
      name: "Text Comparison",
      url: "/dashboard/text-comparison",
      icon: GitCompare,
    },
    {
      name: "Commit Message Generator",
      url: "/dashboard/commit-message-generator",
      icon: GitCommit,
    },
    {
      name: "JSON Visualizer",
      url: "/dashboard/json-visualizer",
      icon: FileJson,
    },
    {
      name: "Regex Builder",
      url: "/dashboard/regex-builder",
      icon: Code,
    },
    {
      name: "Request New Tool",
      url: "/dashboard/tool-request",
      icon: PlusCircle,
    },
  ],
};
