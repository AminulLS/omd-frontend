import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-50">
      <div className="container mx-auto px-4">
        {/* CTA Section */}
        <div className="py-12 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-20" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Best Ad Solutions for your Business</h3>
              <p className="text-slate-400">Become an Advertiser or Publisher on our network</p>
            </div>
            <Link href="#">
              <Button size="lg" variant="secondary">
                Get started now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo */}
          <div>
            <div className="mb-4">
              <Image src="/om_logo_wht.svg" alt="Operation Media" width={150} height={24} className="h-6 w-auto" />
            </div>
          </div>

          {/* Column 2: Advertisers & Publishers */}
          <div>
            <h5 className="font-bold mb-4">Advertisers & Publishers</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="#features" className="hover:text-white">Services</Link></li>
              <li><Link href="#contact" className="hover:text-white">Dashboard Login</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h5 className="font-bold mb-4">Support</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="#faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="#contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h5 className="font-bold mb-4">Contact</h5>
            <div className="space-y-4 text-slate-400">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0" />
                <p>1 SE 3rd ave suite 2220 <br />Miami, FL 33131</p>
              </div>
              <div className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <p>(888) 835-1285</p>
              </div>
              <div className="flex gap-3">
                <Mail className="h-5 w-5 shrink-0" />
                <p>info@operationmediallc.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p>2018 - 2026 <Link href="/" className="hover:text-white">Operation Media LLC</Link></p>
        </div>
      </div>
    </footer>
  )
}
