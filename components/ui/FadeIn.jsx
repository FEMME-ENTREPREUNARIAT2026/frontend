'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * FadeIn — anime un bloc quand il entre dans le viewport.
 * props:
 *   delay     : délai en secondes (default 0)
 *   direction : 'up' | 'down' | 'left' | 'right' (default 'up')
 *   duration  : durée en secondes (default 0.6)
 *   className : classes Tailwind additionnelles
 *   as        : tag HTML rendu (default 'div')
 */
export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  className = '',
  as = 'div',
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const offsets = {
    up:    { y: 32, x: 0 },
    down:  { y: -32, x: 0 },
    left:  { y: 0, x: 32 },
    right: { y: 0, x: -32 },
  }

  const Tag = motion[as] || motion.div

  return (
    <Tag
      ref={ref}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Tag>
  )
}
