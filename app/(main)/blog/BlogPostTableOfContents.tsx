'use client'

import { clsxm } from '@zolplay/utils'
import { motion, type Variants } from 'framer-motion'
import React from 'react'

export interface HeadingNode {
  _type: 'span'
  text: string
  _key: string
}

export interface Node {
  _type: 'block'
  style: 'h1' | 'h2' | 'h3' | 'h4'
  _key: string
  children?: HeadingNode[]
}

export const parseOutline = (nodes: Node[]) => {
  return nodes
    .filter((node) => node._type === 'block' && node.style.startsWith('h'))
    .map((node) => {
      return {
        style: node.style,
        text: node.children?.map((child) => child.text ?? '').join('') ?? '',
        id: node._key,
      }
    })
}

export function useHighlightedHeadingId(
  outline: ReturnType<typeof parseOutline>
) {
  const [highlightedHeadingId, setHighlightedHeadingId] = React.useState<
    string | null
  >(null)

  React.useEffect(() => {
    const updateHighlightedHeading = () => {
      const articleElement = document.querySelector<HTMLElement>(
        'article[data-postid]'
      )
      if (!articleElement) return

      if (articleElement.getBoundingClientRect().bottom <= 0) {
        setHighlightedHeadingId(null)
        return
      }

      const headingElements = Array.from(
        articleElement.querySelectorAll<HTMLElement>('[id]')
      )
      let currentHeadingId: string | null = null

      for (const node of outline) {
        const element = headingElements.find((heading) => heading.id === node.id)
        if (element && element.getBoundingClientRect().top <= 180) {
          currentHeadingId = node.id
        }
      }

      setHighlightedHeadingId(currentHeadingId ?? outline[0]?.id ?? null)
    }

    updateHighlightedHeading()
    window.addEventListener('scroll', updateHighlightedHeading, {
      passive: true,
    })
    window.addEventListener('resize', updateHighlightedHeading)

    return () => {
      window.removeEventListener('scroll', updateHighlightedHeading)
      window.removeEventListener('resize', updateHighlightedHeading)
    }
  }, [outline])

  return highlightedHeadingId
}

const listVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.08,
      delay: 0.255,
      type: 'spring',
      stiffness: 150,
      damping: 20,
    },
  },
} satisfies Variants
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 5,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  },
} satisfies Variants

export function BlogPostTableOfContents({ headings }: { headings: Node[] }) {
  const outline = React.useMemo(() => parseOutline(headings), [headings])
  const highlightedHeadingId = useHighlightedHeadingId(outline)

  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={listVariants}
      className="group pointer-events-auto flex flex-col space-y-2 text-zinc-600"
    >
      {outline.map((node) => (
        <motion.li
          key={node.id}
          variants={itemVariants}
          className={clsxm(
            'relative text-[12px] font-medium leading-[18px] transition-colors duration-300',
            node.style === 'h3' && 'ml-1',
            node.style === 'h4' && 'ml-2',
            node.id === highlightedHeadingId
              ? 'text-zinc-900 before:absolute before:left-0 before:top-0.5 before:h-4 before:w-0.5 before:rounded-full before:bg-lime-500 dark:text-zinc-200 dark:before:bg-lime-400'
              : 'hover:text-zinc-700 dark:hover:text-zinc-400 group-hover:[&:not(:hover)]:text-zinc-500 dark:group-hover:[&:not(:hover)]:text-zinc-400'
          )}
          aria-label={node.id === highlightedHeadingId ? '当前位置' : undefined}
        >
          <a href={`#${node.id}`} className="block w-full">
            {node.text}
          </a>
        </motion.li>
      ))}
    </motion.ul>
  )
}
