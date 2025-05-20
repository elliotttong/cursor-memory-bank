import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
// import { Analytics } from "@vercel/analytics/next" // Removed Vercel Analytics
import { PostHogProvider } from './providers' // Added PostHogProvider
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlowRead - Turn boring text into audio you'll actually listen to",
  description:
    "A Chrome extension that turns articles, docs, and web pages into audio so you can learn more stuff without reading.",
  icons: {
    icon: "/flowread-favicon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://getlaunchlist.com/js/widget-diy.js" strategy="lazyOnload" />
      </head>
      <body className={inter.className}>
        <PostHogProvider> {/* Added PostHogProvider wrapper */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
            <Toaster />
            {/* <Analytics /> Removed Vercel Analytics */}
        </ThemeProvider>
        </PostHogProvider> {/* Added PostHogProvider wrapper */}
      </body>
    </html>
  )
}
