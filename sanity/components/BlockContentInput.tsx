'use client'

import { Stack } from '@sanity/ui'
import React from 'react'
import { type ArrayOfObjectsInputProps } from 'sanity'

import { WritingIconPicker } from '~/sanity/components/WritingIconPicker'

/** 正文编辑器：上方挂写作图标选择器 */
export function BlockContentInput(props: ArrayOfObjectsInputProps) {
  return (
    <Stack space={3}>
      <WritingIconPicker />
      {props.renderDefault(props)}
    </Stack>
  )
}
