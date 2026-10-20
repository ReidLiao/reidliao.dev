import { Button, Flex, Menu, MenuButton, MenuItem, Text } from '@sanity/ui'
import { set, type StringInputProps } from 'sanity'

const swatches: Record<string, string> = {
  lime: '#84cc16',
  emerald: '#10b981',
  sky: '#0ea5e9',
  amber: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  zinc: '#71717a',
}

export function ColorSwatchInput(props: StringInputProps) {
  const options = (props.schemaType.options?.list ?? []) as Array<{ title: string; value: string }>
  const selected = options.find(({ value }) => value === props.value)
  return (
    <MenuButton
      id={props.id || `color-${props.schemaType.name}`}
      button={
        <Button mode="ghost" disabled={props.readOnly} padding={2}>
          <Flex align="center" gap={2}>
            <span aria-hidden="true" style={{ backgroundColor: swatches[selected?.value ?? 'lime'], borderRadius: '50%', display: 'inline-block', height: 10, width: 10 }} />
            <Text size={1}>{selected?.title ?? '选择颜色'}</Text>
          </Flex>
        </Button>
      }
      menu={
        <Menu>
          {options.map(({ title, value }) => (
            <MenuItem
              key={value}
              text={
                <Flex align="center" gap={2}>
                  <span aria-hidden="true" style={{ backgroundColor: swatches[value], borderRadius: '50%', display: 'inline-block', height: 10, width: 10 }} />
                  <Text size={1}>{title}</Text>
                </Flex>
              }
              selected={props.value === value}
              onClick={() => props.onChange(set(value))}
            />
          ))}
        </Menu>
      }
    />
  )
}
