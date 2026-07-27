'use client'

import { ClipboardIcon, SearchIcon } from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@sanity/ui'
import React from 'react'

import {
  type WritingIcon,
  writingIconGroups,
} from '~/sanity/lib/writing-icons'

function isPortableTextEditable(el: Element | null) {
  if (!el || !(el instanceof HTMLElement)) return false
  if (el.isContentEditable) return true
  return Boolean(
    el.closest('[contenteditable="true"]') ||
      el.closest('[data-testid="pt-editor"]')
  )
}

function tryInsertAtCursor(emoji: string) {
  const active = document.activeElement
  if (!isPortableTextEditable(active)) return false

  // Portable Text 编辑区聚焦时，直接插入到光标位置
  try {
    return document.execCommand('insertText', false, emoji)
  } catch {
    return false
  }
}

async function copyEmoji(emoji: string) {
  try {
    await navigator.clipboard.writeText(emoji)
    return true
  } catch {
    return false
  }
}

function IconButton({
  icon,
  onPick,
}: {
  icon: WritingIcon
  onPick: (icon: WritingIcon, mode: 'inserted' | 'copied' | 'failed') => void
}) {
  return (
    <Tooltip
      content={
        <Box padding={2} style={{ maxWidth: 220 }}>
          <Text size={1} weight="semibold">
            {icon.emoji} {icon.label}
          </Text>
          <Box marginTop={2}>
            <Text size={1} muted>
              {icon.hint}
            </Text>
          </Box>
        </Box>
      }
      placement="top"
      portal
    >
      <Button
        mode="ghost"
        padding={2}
        fontSize={3}
        aria-label={`插入 ${icon.label}`}
        text={`${icon.emoji}`}
        onMouseDown={(e) => {
          // 避免点击按钮抢走 PT 编辑器焦点，便于 insertText
          e.preventDefault()
        }}
        onClick={async () => {
          if (tryInsertAtCursor(icon.emoji)) {
            onPick(icon, 'inserted')
            return
          }
          const ok = await copyEmoji(icon.emoji)
          onPick(icon, ok ? 'copied' : 'failed')
        }}
        style={{ minWidth: 40, minHeight: 36 }}
      />
    </Tooltip>
  )
}

export function WritingIconPicker() {
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(true)

  const filteredGroups = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return writingIconGroups

    return writingIconGroups
      .map((group) => ({
        ...group,
        icons: group.icons.filter((icon) => {
          const hay = `${icon.emoji} ${icon.label} ${icon.hint} ${group.title}`.toLowerCase()
          return hay.includes(q)
        }),
      }))
      .filter((group) => group.icons.length > 0)
  }, [query])

  const onPick = React.useCallback(
    (icon: WritingIcon, mode: 'inserted' | 'copied' | 'failed') => {
      if (mode === 'inserted') {
        setStatus(`已插入 ${icon.emoji} ${icon.label}`)
      } else if (mode === 'copied') {
        setStatus(`已复制 ${icon.emoji}，在正文中粘贴即可`)
      } else {
        setStatus('插入/复制失败，请手动输入')
      }
      window.setTimeout(() => setStatus(null), 2200)
    },
    []
  )

  return (
    <Card
      padding={3}
      radius={2}
      shadow={1}
      tone="transparent"
      border
      style={{ background: 'var(--card-bg-color)' }}
    >
      <Flex align="center" gap={3} justify="space-between">
        <Flex align="center" gap={2}>
          <Text size={1} weight="semibold">
            写作图标
          </Text>
          <Text size={1} muted>
            点选插入光标处；若未聚焦正文则复制到剪贴板
          </Text>
        </Flex>
        <Button
          mode="bleed"
          text={open ? '收起' : '展开'}
          onClick={() => setOpen((v) => !v)}
        />
      </Flex>

      {open ? (
        <Stack space={3} marginTop={3}>
          <TextInput
            icon={SearchIcon}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="搜索：Docker、DNS、排错…"
            fontSize={1}
          />

          {filteredGroups.map((group) => (
            <Stack key={group.id} space={2}>
              <Flex align="center" gap={2}>
                <Text size={1}>
                  {group.emoji} {group.title}
                </Text>
                <Text size={1} muted>
                  {group.description}
                </Text>
              </Flex>
              <Flex gap={1} wrap="wrap">
                {group.icons.map((icon) => (
                  <IconButton key={icon.emoji + icon.label} icon={icon} onPick={onPick} />
                ))}
              </Flex>
            </Stack>
          ))}

          {filteredGroups.length === 0 ? (
            <Text size={1} muted>
              没有匹配的图标
            </Text>
          ) : null}

          <Flex align="center" gap={2}>
            <ClipboardIcon />
            <Text size={1} muted>
              {status ?? '先点击正文定位光标，再点图标可直接插入'}
            </Text>
          </Flex>
        </Stack>
      ) : null}
    </Card>
  )
}
