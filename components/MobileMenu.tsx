import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "./Menu";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden " asChild>
        <Button
          className="rounded-full h-10 w-10 flex items-center justify-center bg-white hover:bg-white/80 border-none"
          variant="outline"
          size="icon"
        >
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/assets/CompanyLogo.png"
                alt="Company Logo"
                width={150}
                height={50}
                className={cn(
                  "transition-[transform,opacity,display] ease-in-out duration-300"
                )}
              />
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
