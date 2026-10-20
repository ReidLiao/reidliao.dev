'use client'

import React from 'react'
import { type ArrayOfObjectsInputProps } from 'sanity'

/** Attach a scoped hook for the Studio rich-text width and typography overrides. */
export function BlockContentInput(props: ArrayOfObjectsInputProps) {
  return (
    <div className="reidliao-richtext-editor">
      {props.renderDefault(props)}
    </div>
  )
}
