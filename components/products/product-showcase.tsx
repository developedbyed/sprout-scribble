"use client"

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { VariantsWithImagesTags } from "@/lib/infer-type"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function ProductShowcase({
  variants,
}: {
  variants: VariantsWithImagesTags[]
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeThumbnail, setActiveThumbnail] = useState([0])
  const searchParams = useSearchParams()
  const selectedColor = searchParams.get("type") || variants[0].productType

  const updatePreview = (index: number) => {
    api?.scrollTo(index)
  }

  useEffect(() => {
    if (!api) {
      return
    }

    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView())
    })
  }, [api])

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((img) => {
              return (
                <CarouselItem key={img.url}>
                  {img.url ? (
                    <Image
                      priority
                      className="rounded-md"
                      width={1280}
                      height={720}
                      src={img.url}
                      alt={img.name}
                    />
                  ) : null}
                </CarouselItem>
              )
            })
        )}
      </CarouselContent>
      <div className="flex overflow-clip py-2 gap-4">
        {variants.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((img, index) => {
              return (
                <div key={img.url}>
                  {img.url ? (
                    <Image
                      onClick={() => updatePreview(index)}
                      priority
                      className={cn(
                        index === activeThumbnail[0]
                          ? "opacity-100"
                          : "opacity-75",
                        "rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75"
                      )}
                      width={72}
                      height={48}
                      src={img.url}
                      alt={img.name}
                    />
                  ) : null}
                </div>
              )
            })
        )}
      </div>
    </Carousel>
  )
}
