"use client"

import { InstantSearchNext } from "react-instantsearch-nextjs"
import { SearchBox, Hits } from "react-instantsearch"
import { searchClient } from "@/lib/algolia-client"
import Link from "next/link"
import Image from "next/image"
import { Card } from "../ui/card"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

function Hit({
  hit,
}: {
  hit: {
    objectID: string
    id: string
    price: number
    title: string
    productType: string
    variantImages: string

    _highlightResult: {
      title: {
        value: string
        matchLevel: string
        fullyHighlighted: boolean
        matchedWords: string[]
      }
      productType: {
        value: string
        matchLevel: string
        fullyHighlighted: boolean
        matchedWords: string[]
      }
    }
  }
}) {
  return (
    <div className="p-4 mb-2 hover:bg-secondary ">
      <Link
        href={`/products/${hit.objectID}?id=${hit.objectID}&productID=${hit.id}&price=${hit.price}&title=${hit.title}&type=${hit.productType}&image=${hit.variantImages[0]}&variantID=${hit.objectID}`}
      >
        <div className="flex w-full gap-12 items-center justify-between">
          <Image
            src={hit.variantImages}
            alt={hit.title}
            width={60}
            height={60}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.title.value,
            }}
          ></p>

          <p
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.productType.value,
            }}
          ></p>
          <p className="font-medium">${hit.price}</p>
        </div>
      </Link>
    </div>
  )
}

export default function Algolia() {
  const [active, setActive] = useState(false)

  const MCard = useMemo(() => motion(Card), [])
  return (
    <InstantSearchNext
      future={{
        persistHierarchicalRootCount: true,
        preserveSharedStateOnUnmount: true,
      }}
      indexName="products"
      searchClient={searchClient}
    >
      <div className="relative">
        <SearchBox
          onFocus={() => setActive(true)}
          onBlur={() => {
            setTimeout(() => {
              setActive(false)
            }, 100)
          }}
          classNames={{
            input:
              " h-full w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            submitIcon: "hidden",
            form: "relative mb-4",
            resetIcon: "hidden",
          }}
        />
        <AnimatePresence>
          {active && (
            <MCard
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute w-full z-50 overflow-y-scroll h-96"
            >
              <Hits hitComponent={Hit} className="rounded-md" />
            </MCard>
          )}
        </AnimatePresence>
      </div>
    </InstantSearchNext>
  )
}
