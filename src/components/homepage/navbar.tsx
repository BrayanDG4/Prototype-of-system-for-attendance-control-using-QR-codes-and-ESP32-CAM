"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import checkIcon from "../../assets/homepage/check-icon.png";
import Image from "next/image";

const navItems = [
  { title: "Inicio", href: "/" },
  { title: "Nuestra plataforma", href: "#about" },
  { title: "Contacto", href: "#footer" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 w-full items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-6 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src={checkIcon} alt="Attendify" width={20} height={20} />

            <span className="hidden font-bold sm:inline-block text-2xl">
              Attendify
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <Image src={checkIcon} alt="Attendify" width={20} height={20} />
              <span className="px-2 text-xl font-bold">Attendify</span>
            </Link>
            <div className="my-4 flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-foreground/70  transition-colors hover:text-foreground",
                    pathname === item.href && "text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Registrarse</Link>
            </Button>
          </nav>
          </div>
          
        </div>
      </div>
    </header>
  );
}
