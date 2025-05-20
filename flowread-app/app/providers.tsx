"use client"

import { ReactNode } from 'react'
import { PostHogProvider } from '../components/PostHogProvider'

export function Providers({ children }: { children: ReactNode }) {
  return <PostHogProvider>{children}</PostHogProvider>
}
