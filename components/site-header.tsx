import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-muted/50 py-2 text-sm border-b">
        <div className="container mx-auto flex justify-between px-4">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+1 (888) 835-1285</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:info@operationmediallc.com" className="hover:underline">
                info@operationmediallc.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl uppercase">
            <Image src="/om_logo.svg" alt="Operation Media" width={150} height={32} className="h-8 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Services
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary">
              Contact Us
            </Link>
            <Link href="/auth/login">
              <Button className="text-sm font-medium hover:cursor-pointer">
                Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-1 mt-8 px-4">
                <Link href="/" className="flex w-full items-center gap-x-3 p-2 text-left text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white">
                  Home
                </Link>
                <Link href="#features" className="flex w-full items-center gap-x-3 p-2 text-left text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white">
                  Services
                </Link>
                <Link href="#contact" className="flex w-full items-center gap-x-3 p-2 text-left text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white">
                  Contact Us
                </Link>
                <Link href="/auth/login">
                  <Button className="w-full">Login</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  )
}
