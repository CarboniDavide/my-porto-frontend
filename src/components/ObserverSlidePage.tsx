import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Observer } from 'gsap/Observer'
import gsap from 'gsap'

gsap.registerPlugin(Observer)

type ObserverSlidePageProps = {
  totalSlides?: number
  children: ReactNode
}

export function ObserverSlidePage({ totalSlides, children }: ObserverSlidePageProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [autoTotalSlides, setAutoTotalSlides] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    setActiveSlide(0)
  }, [pathname])

  useEffect(() => {
    if (!containerRef.current) return

    const sections = gsap.utils.toArray<HTMLElement>(
      containerRef.current.querySelectorAll('[data-slide]')
    )
    const totalSections = sections.length
    setAutoTotalSlides(totalSections)
    let currentIndex = 0
    let isAnimating = false
    let animationTimer: number | undefined

    const getClosestIndex = () => {
      const scrollTop = window.scrollY
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      sections.forEach((section, index) => {
        const distance = Math.abs(section.offsetTop - scrollTop)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      return closestIndex
    }

    const syncFromScroll = () => {
      const nextIndex = getClosestIndex()
      currentIndex = nextIndex
      setActiveSlide((prev) => (prev === nextIndex ? prev : nextIndex))
    }

    syncFromScroll()

    const gotoSection = (index: number) => {
      if (index < 0 || index >= totalSections || isAnimating) return
      isAnimating = true
      currentIndex = index
      setActiveSlide(index)
      window.scrollTo({ top: sections[index].offsetTop, behavior: 'smooth' })
      if (animationTimer) window.clearTimeout(animationTimer)
      animationTimer = window.setTimeout(() => {
        isAnimating = false
        syncFromScroll()
      }, 900)
    }

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    let observer: Observer | undefined
    if (isDesktop) {
      observer = Observer.create({
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        onDown: () => gotoSection(currentIndex - 1),
        onUp: () => gotoSection(currentIndex + 1),
        tolerance: 10,
        preventDefault: false,
      })
    }

    const handleScroll = () => {
      syncFromScroll()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      if (observer) observer.kill()
      if (animationTimer) window.clearTimeout(animationTimer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [pathname])

  return (
    <section className="relative isolate overflow-x-hidden">
      <div className="page-glow" aria-hidden="true" />
      <div className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:flex lg:flex-col lg:gap-3" aria-hidden="true">
        {Array.from({ length: totalSlides ?? autoTotalSlides }).map((_, index) => (
          <span
            key={index}
            className={`h-2.5 w-2.5 rounded-full border border-[#d66d28] transition ${
              activeSlide === index ? 'scale-125 bg-[#d66d28]' : 'bg-transparent opacity-60'
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col" ref={containerRef}>
        {children}
      </div>
    </section>
  )
}
