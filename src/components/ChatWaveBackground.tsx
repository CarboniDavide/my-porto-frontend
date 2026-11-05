import { useEffect, useRef } from 'react'

/**
 * Animated flowing wave lines rendered on a full-size canvas, used as the
 * decorative background of the chat page. Respects `prefers-reduced-motion`.
 */
export function ChatWaveBackground() {
  const neuralCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = neuralCanvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let frameId = 0

    function resizeCanvas() {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    function draw(time: number) {
      context.clearRect(0, 0, width, height)
      const top = height * 0.5
      const lineCount = 22
      const spacing = (height - top) / (lineCount - 1)
      const t = time * 0.00004
      const step = 8
      const gradient = context.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, '#6558e8')
      gradient.addColorStop(0.35, '#3b82f6')
      gradient.addColorStop(0.65, '#06b6d4')
      gradient.addColorStop(1, '#ec4899')
      context.strokeStyle = gradient

      for (let line = 0; line < lineCount; line += 1) {
        const baseY = top + line * spacing
        const depth = line / lineCount
        context.beginPath()
        for (let x = 0; x <= width + step; x += step) {
          const nx = x / width
          const amplitude = 0.35 + 1.25 * Math.sin(nx * 2.4 + t * 0.9 + line * 0.04) ** 2
          const swell = Math.sin(nx * 3.2 + t * 1.3 + line * 0.11) * (18 + 40 * depth) * amplitude
          const ripple = Math.sin(nx * 7.5 - t * 1.9 + line * 0.2) * 12 * amplitude
          const drift = Math.sin(nx * 1.4 - t * 0.8 + line * 0.05) * 26
          // Lines sag toward the center and flatten out toward the bottom
          const sag = Math.sin(nx * Math.PI) * height * 0.09 * (1 - depth)
          const y = baseY + swell + ripple + drift + sag
          if (x === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        const alpha = (0.05 + 0.2 * depth) * (0.7 + 0.3 * Math.sin(line * 0.35 + t * 1.2) ** 2)
        context.globalAlpha = Math.min(1, alpha * 1.6)
        context.lineWidth = 1.2
        context.stroke()
      }
      context.globalAlpha = 1

      if (!motionPreference.matches) frameId = window.requestAnimationFrame(draw)
    }
    function handleMotionPreferenceChange() {
      window.cancelAnimationFrame(frameId)
      draw(0)
    }

    function handleResize() {
      resizeCanvas()
      if (motionPreference.matches) draw(0)
    }

    resizeCanvas()
    draw(0)
    window.addEventListener('resize', handleResize)
    motionPreference.addEventListener('change', handleMotionPreferenceChange)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      motionPreference.removeEventListener('change', handleMotionPreferenceChange)
    }
  }, [])

  return (
    <div className="chat-background fixed inset-x-0 bottom-0 top-16 z-0" aria-hidden="true">
      <span className="chat-background-orb chat-background-orb-one" />
      <span className="chat-background-orb chat-background-orb-two" />
      <canvas ref={neuralCanvasRef} className="chat-neural-canvas" aria-hidden="true" />
    </div>
  )
}
