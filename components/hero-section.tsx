import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary to-secondary pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" id="home">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 drop-shadow-sm">
              Our operation is to <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">get you to a job!</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
              Operation Media specializes in performance marketing. Our skill set is in Online Marketing our medium of choice is Facebook, Google Ads or Email Marketing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#contact">
                <Button size="lg" variant="secondary">
                  Contact us <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl p-2">
               <div className="relative w-full h-full rounded-lg overflow-hidden bg-white">
                 <Image
                   src="/home-img.png"
                   alt="Hero Image"
                   fill
                   className="object-contain"
                   priority
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

