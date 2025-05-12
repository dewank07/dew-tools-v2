import { PointerHighlight } from "@/components/ui/pointer-highlight";

// import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className='h-screen flex flex-col gap-6 sm:gap-8 justify-center items-center w-full overflow-hidden'>
      <div className='text-2xl sm:text-3xl md:text-4xl font-normal text-neutral-600 dark:text-neutral-400 text-center w-7/12'>
        Make building faster with
        <PointerHighlight
          rectangleClassName='bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 leading-loose'
          pointerClassName='text-green-500 h-2 w-2 sm:h-3 sm:w-3'
          containerClassName='inline-block ml-1'
        >
          <span className='relative z-10'>Dew Tools.</span>
        </PointerHighlight>
      </div>
      <Link
        className='rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-7/12 md:w-2/12'
        href='/dashboard'
      >
        Get started
      </Link>
    </div>
  );
}
