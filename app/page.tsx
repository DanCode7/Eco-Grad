"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "@/components/profile-dropdown"

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn")
    setIsLoggedIn(loginStatus === "true")
  }, [])

  const handleSellClick = () => {
    if (isLoggedIn) {
      router.push("/my-posts")
    } else {
      router.push("/auth")
    }
  }

  const handleBuyClick = () => {
    router.push("/buy")
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Shantell Sans, Comic Sans MS, cursive, sans-serif" }}>
      {/* Header */}
      <header className="bg-green-600 text-white py-8">
        <div className="container mx-auto px-4 relative">
          <h1 className="text-6xl font-bold text-white text-center">EcoGrad</h1>
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Main Tagline */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-green-600 font-bold mb-8">Sell or buy regalia today</h2>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mb-12">
            <Button
              onClick={handleSellClick}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl font-bold rounded-lg"
            >
              Sell
            </Button>
            <Button
              onClick={handleBuyClick}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl font-bold rounded-lg"
            >
              Buy
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed border-gray-400 my-12"></div>

          {/* Mission Statement Section */}
          <div className="max-w-5xl mx-auto text-left">
            <h3 className="text-3xl text-green-600 font-bold mb-6 text-center">Mission Statement</h3>
            
            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                We aim to make graduation more sustainable by encouraging the reuse, resale, and donation of caps, gowns, and accessories. By reducing demand for new polyester-based regalia, we help lower pollution and limit waste. Our platform connects graduates so they can celebrate their achievements without compromising the planet.
              </p>
              
              <p className="text-lg leading-relaxed">
                Every year, millions of students graduate wearing caps, gowns, and stoles made from 100% polyester. Most of this regalia is only worn once, then discarded, contributing to growing textile waste and environmental harm. As past and future graduating students, we recognize our role in the overconsumption of graduation regalia, which is often purchased for a single use and then discarded. Our mission is to reduce textile waste and make graduation ceremonies more accessible by providing a platform where students can donate, resell, or reuse caps, gowns, and stoles. We believe that every student, regardless of financial background, should be able to celebrate their achievements without facing unnecessary environmental or economic burdens.
              </p>

              {/* Divider */}
              <div className="border-t-2 border-dashed border-gray-400 my-8"></div>

              <h3 className="text-2xl text-green-600 font-bold mt-8 mb-4 text-center">Why donate?</h3>
              
              <p className="text-lg leading-relaxed">
                Polyester is one of the least sustainable fabrics. It's made from polyethylene terephthalate (PET), a material derived from crude oil which is a non-renewable fossil fuel (Stanes et al, 2017). The production process uses a lot of energy and chemicals, and the fabric doesn't easily break down. Once discarded, polyester often ends up in landfills or is incinerated, releasing greenhouse gases into the atmosphere (Palacios-Mateo et al., 2021).
              </p>
              
              <div className="my-8 flex flex-col items-center">
                <img 
                  src="/polyester-fibers-pet.jpg" 
                  alt="Polyester fibers and PET plastic pellets comparison"
                  className="rounded-lg shadow-lg max-w-full h-auto"
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Polyester fibers and PET plastic pellets, left to right.</p>
                  <a 
                    href="https://thrifttale.com/blogs/thrifttalk/why-is-fast-fashion-polyester-a-problem?srsltid=AfmBOorumXMixugzySAATKVPQHi_KOhV4eWO3TCav-y_RaLPBcyvtlwj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Source
                  </a>
                </div>
              </div>
              
              <p className="text-lg leading-relaxed">
                On a microscopic level, polyester sheds microplastics during washing and after disposal. These microplastics can make their way into oceans, where they are consumed by marine life and harm entire ecosystems (Palacios-Mateo et al., 2021). Humans also inhale and ingest microplastics daily, especially those living near factories or working in the textile industry.
              </p>
              
              <p className="text-lg leading-relaxed">
                Despite its environmental impact, polyester remains popular because it's cheap to produce and designed to mimic natural fibers like cotton (Stanes et al, 2017). But with low recycling rates and high levels of pollution, it's clear that the current model is not sustainable.
              </p>
              
              <p className="text-lg leading-relaxed">
                Modern graduation attire began with the 1895 Intercollegiate Code of Academic Costume, which was based on Columbia University's dress codes and is now widely used in the United States (IRAC 1895). Academic dress originated in 12th- and 13th-century Europe, where long gowns and hoods helped students and professors stay warm in unheated buildings (Sullivan 1997). While European universities still use a variety of colors to represent different fields of study, the United States standardized graduation attire in the late 1800s with black gowns and specific trimmings to indicate majors (NYT 1896).
              </p>
              
              <p className="text-lg leading-relaxed">
                Today, most graduation gowns are made from polyester, a lightweight and durable fabric that can be produced quickly and economically to meet rising demand (Keeper 2025). Historically, gowns were made from silk and heavier fabrics when education was only available to the wealthy. As higher education became more accessible, polyester became the standard for mass production (Wolgast 2009). This shift has created a large environmental impact, which is why reusing, reselling, and donating graduation regalia is so important.
              </p>
            </div>
          </div>
          
          {/* Reference Section */}
          <div className="mt-12">
            {/* Divider - same as above */}
            <div className="border-t-2 border-dashed border-gray-400 mb-12"></div>
            
            <div className="text-center">
              <a 
                href="https://docs.google.com/document/d/1YADRt_5lUWG0BSegVcKdURNu2QO_iNT-6uVApA3R-BE/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-green-600 hover:text-green-700 font-semibold text-lg transition-colors"
              >
                Reference
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
