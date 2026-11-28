import { type PortableTextComponentProps } from '@portabletext/react'

import { Accordion, type AccordionEntry } from '~/components/shadcn/accordion'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  type AlertVariant,
} from '~/components/shadcn/alert'
import { Badge } from '~/components/shadcn/badge'
import { Card, CardDescription } from '~/components/shadcn/card'
import { Collapsible } from '~/components/shadcn/collapsible'
import { Separator } from '~/components/shadcn/separator'
import { Table, TableCell, TableHeadCell } from '~/components/shadcn/table'
import { type TabEntry, Tabs } from '~/components/shadcn/tabs'

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> =>
        Boolean(asRecord(item))
      )
    : []
}

export function PortableTextAccordion({
  value,
}: PortableTextComponentProps<unknown>) {
  const block = asRecord(value)
  const items: AccordionEntry[] = asRecords(block?.items).map((item) => ({
    _key: asText(item._key),
    title: asText(item.title),
    content: asText(item.content),
  }))

  return items.length ? <Accordion items={items} /> : null
}

export function PortableTextAlert({
  value,
}: PortableTextComponentProps<unknown>) {
  const block = asRecord(value)
  const variant = asText(block?.variant)
  const allowedVariants: AlertVariant[] = [
    'info',
    'success',
    'warning',
    'error',
  ]
  const alertVariant = allowedVariants.includes(variant as AlertVariant)
    ? (variant as AlertVariant)
    : 'info'
  const title = asText(block?.title)
  const content = asText(block?.content)

  if (!title && !content) return null

  return (
    <Alert variant={alertVariant} className="my-6">
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {content ? (
        <AlertDescription className="whitespace-pre-line">
          {content}
        </AlertDescription>
      ) : null}
    </Alert>
  )
}

export function PortableTextTable({
  value,
}: PortableTextComponentProps<unknown>) {
  const block = asRecord(value)
  const headers = Array.isArray(block?.headers) ? block.headers.map(asText) : []
  const rows = asRecords(block?.rows)

  if (!headers.length) return null

  return (
    <Table>
      {asText(block?.caption) ? (
        <caption className="px-3 py-2 text-left text-sm text-zinc-600 dark:text-zinc-400">
          {asText(block?.caption)}
        </caption>
      ) : null}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <TableHeadCell key={`${header}-${index}`}>{header}</TableHeadCell>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => {
          const cells = Array.isArray(row.cells) ? row.cells : []
          return (
            <tr key={asText(row._key) || rowIndex}>
              {headers.map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  {asText(cells[cellIndex])}
                </TableCell>
              ))}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export function PortableTextTabs({
  value,
}: PortableTextComponentProps<unknown>) {
  const block = asRecord(value)
  const tabs: TabEntry[] = asRecords(block?.tabs)
    .map((tab) => ({
      title: asText(tab.title),
      content: asText(tab.content),
    }))
    .filter((tab) => Boolean(tab.title))

  return tabs.length ? <Tabs tabs={tabs} /> : null
}

export function PortableTextCard({
  value,
}: PortableTextComponentProps<unknown>) {
  const block = asRecord(value)
  const title = asText(block?.title)
  const description = asText(block?.description)
  const badge = asText(block?.badge)

  if (!title && !description) return null

  return (
    <Card className="my-6 w-full p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        {title ? (
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
        ) : null}
        {badge ? <Badge>{badge}</Badge> : null}
      </div>
      {description ? (
        <CardDescription className="mt-2 leading-relaxed whitespace-pre-line">
          {description}
        </CardDescription>
      ) : null}
    </Card>
  )
}

export function PortableTextBadge({
  value,
}: PortableTextComponentProps<unknown>) {
  const block = asRecord(value)
  const label = asText(block?.label)
  if (!label) return null

  return (
    <div className="my-2">
      <Badge variant={block?.variant === 'neutral' ? 'secondary' : 'default'}>
        {label}
      </Badge>
    </div>
  )
}

export function PortableTextCollapsible({
  value,
}: PortableTextComponentProps<unknown>) {
  const block = asRecord(value)
  const title = asText(block?.title)
  const content = asText(block?.content)
  if (!title || !content) return null

  return (
    <Collapsible
      title={title}
      content={content}
      defaultOpen={block?.defaultOpen === true}
    />
  )
}

export function PortableTextSeparator({
  value,
}: PortableTextComponentProps<unknown>) {
  const block = asRecord(value)
  return <Separator label={asText(block?.label) || undefined} />
}
