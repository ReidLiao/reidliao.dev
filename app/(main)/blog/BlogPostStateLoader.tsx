'use client'

import React from 'react'

import { blogPostState } from '~/app/(main)/blog/blog-post.state'
import { type Post } from '~/sanity/schemas/post'

export function BlogPostStateLoader({ post }: { post: Post }) {
  React.useEffect(() => {
    if (blogPostState.postId !== post._id) {
      blogPostState.comments = []
      blogPostState.currentBlockId = null
      blogPostState.replyingTo = null
    }
    blogPostState.postId = post._id
  }, [post._id])

  return null
}
