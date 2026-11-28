'use client'

import React from 'react'

import { blogPostState } from '~/app/(main)/blog/blog-post.state'
export function BlogPostStateLoader({ postId }: { postId: string }) {
  React.useEffect(() => {
    if (blogPostState.postId !== postId) {
      blogPostState.comments = []
      blogPostState.currentBlockId = null
      blogPostState.replyingTo = null
    }
    blogPostState.postId = postId
  }, [postId])

  return null
}
