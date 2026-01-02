import { NotebookText, FileEdit, Headphones, Anchor } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Anchor className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Services Offered</h3>
          <p className="text-lg text-muted-foreground">
            Well engineered products in all things job related.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
             <div className="relative aspect-square w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30" />
                <Image
                  src="/features-img-1.png"
                  alt="Features Image"
                  fill
                  className="object-contain relative z-10 drop-shadow-xl"
                />
             </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <NotebookText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Emails and SMS Job Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Reach candidates directly with targeted email and SMS campaigns designed to convert.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileEdit className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Sponsored Jobs Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Boost visibility for your job postings with premium placement across our network.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Job Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Distribute your jobs to hundreds of job boards and aggregators with a single click.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

