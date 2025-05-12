"use client";

import { SearchIcon, SidebarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// import { SearchForm } from "@/components/search-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { data } from "@/constants/constants";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    router.push(url);
    setOpen(false);
  };

  return (
    <header className='bg-background sticky top-0 z-50 flex w-full items-center border-b'>
      <div className='flex h-(--header-height) w-full items-center gap-2 px-4'>
        <Button className='h-8 w-8' variant='ghost' size='icon' onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb className='hidden sm:block'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            {pathname.split("/dashboard/")[1] && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {pathname.split("/dashboard/")[1].charAt(0).toUpperCase() +
                      pathname.split("/dashboard/")[1].slice(1).replace(/-/g, " ")}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className='w-full sm:ml-auto sm:w-auto flex items-center gap-2'>
          {/* Desktop search button */}
          <Button
            variant='outline'
            className='h-8 px-2 text-xs hidden sm:flex items-center gap-1'
            onClick={() => setOpen(true)}
          >
            <SearchIcon className='h-3.5 w-3.5' />
            <span>Search tools...</span>
            <kbd className='pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100'>
              <span className='text-xs'>⌘</span>K
            </kbd>
          </Button>
          
          {/* Mobile search button */}
          <Button
            variant='outline'
            className='h-8 w-8 sm:hidden flex items-center justify-center'
            size='icon'
            onClick={() => setOpen(true)}
          >
            <SearchIcon className='h-4 w-4' />
          </Button>
          {/* <SearchForm className='w-full sm:w-auto' /> */}
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search tools...' />
        <CommandList>
          <CommandEmpty>No tools found.</CommandEmpty>
          <CommandGroup heading='Tools'>
            {data.projects.map((tool) => (
              <CommandItem key={tool.name} onSelect={() => handleSelect(tool.url)} value={tool.name}>
                <tool.icon className='mr-2 h-4 w-4' />
                <span>{tool.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
