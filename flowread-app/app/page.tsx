"use client"

import type React from "react"
import { ArrowRight, Headphones, Brain, Coffee, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <main className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-rose-500" />
            <span className="font-medium">FlowRead</span>
          </div>
          <a
            href="https://twitter.com/elliottinpublic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-rose-500"
          >
            @elliottinpublic
          </a>
        </header>

        {/* Hero */}
        <div className="mb-10">
          <div className="mb-2 inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800">
            currently building this instead of touching grass
          </div>
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
            ok so I'm making this thing that turns boring text into audio you can actually listen to
          </h1>
          <p className="text-lg text-zinc-700">because who has time to read all that stuff? not me lol</p>
        </div>

        {/* Problem statement */}
        <div className="mb-10 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">the problem (we all have it)</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-lg">😩</div>
              <p className="text-zinc-700">
                <span className="font-medium">too much to read</span> - articles, docs, reddit threads, newsletters that
                pile up in your inbox...
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-lg">⏰</div>
              <p className="text-zinc-700">
                <span className="font-medium">no time</span> - between work, gym, doom scrolling, and trying to have a
                life
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-lg">🧠</div>
              <p className="text-zinc-700">
                <span className="font-medium">information overload</span> - can't remember half the stuff you read
                anyway
              </p>
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">so I built this chrome extension that:</h2>
          <div className="space-y-3">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                  <Headphones className="h-4 w-4 text-rose-500" />
                </div>
                <div>
                  <p className="font-medium">turns any text into audio</p>
                  <p className="text-sm text-zinc-500">articles, blog posts, docs, reddit threads, whatever</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                  <Brain className="h-4 w-4 text-rose-500" />
                </div>
                <div>
                  <p className="font-medium">makes it easy to remember stuff</p>
                  <p className="text-sm text-zinc-500">AI summaries, highlights, notes you'll actually look at later</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                  <Sparkles className="h-4 w-4 text-rose-500" />
                </div>
                <div>
                  <p className="font-medium">works everywhere</p>
                  <p className="text-sm text-zinc-500">
                    queue articles like spotify, listen on your commute, at the gym, wherever
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal note */}
        <div className="mb-10 rounded-xl bg-zinc-100 p-6">
          <div className="mb-4 flex items-center gap-3">
            <img src="https://pbs.twimg.com/profile_images/1769737695339839488/3R01GAtX_400x400.jpg" alt="Elliott" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-medium">why I'm making this</p>
              <p className="text-sm text-zinc-500">the honest truth</p>
            </div>
          </div>
          <p className="mb-4 text-zinc-700">
            I was paying for like 3 different apps to do this stuff and it was still a pain. Plus I kept forgetting
            everything I read.
          </p>
          <p className="mb-4 text-zinc-700">
            Started building this for myself, showed some friends, and they were like "dude I need this yesterday" so
            here we are.
          </p>
          <p className="text-zinc-700">
            Not trying to build some massive startup, just want to make something useful that doesn't suck.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">where it's at right now:</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-green-100 text-center text-sm font-medium text-green-600">✓</div>
              <p className="text-zinc-700">text-to-speech that doesn't sound like a robot from 2010</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-green-100 text-center text-sm font-medium text-green-600">✓</div>
              <p className="text-zinc-700">highlighting words as they're read (so you can follow along)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-green-100 text-center text-sm font-medium text-green-600">✓</div>
              <p className="text-zinc-700">basic controls (play/pause, skip forward/back)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-yellow-100 text-center text-sm font-medium text-yellow-600">
                ⚡
              </div>
              <p className="text-zinc-700">article library & queue system (working on it now)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-zinc-100 text-center text-sm font-medium text-zinc-400">...</div>
              <p className="text-zinc-500">AI summaries & learning tools (coming soon)</p>
            </div>
          </div>
        </div>

        {/* Real talk */}
        <div className="mb-10 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">real talk</h2>
          <p className="mb-4 text-zinc-700">
            I'm aiming to launch the beta in June. It'll be free to try with basic features.
          </p>
          <p className="mb-4 text-zinc-700">
            Premium stuff (like AI summaries, unlimited library) will cost something, but way less than what I was
            paying for multiple apps.
          </p>
          <p className="text-zinc-700">
            Early supporters get 50% off for life because you're awesome and believe in this thing.
          </p>
        </div>

        {/* Waitlist */}
        <div className="mb-10 rounded-xl bg-rose-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Coffee className="h-5 w-5 text-rose-500" />
            <h2 className="text-xl font-semibold">wanna try it?</h2>
          </div>
          <p className="mb-4 text-zinc-700">
            drop your email below and I'll hit you up when the beta is ready (and give you 50% off for life if you
            stick around).
          </p>
          <form
            className="launchlist-form flex items-center gap-2"
            action="https://getlaunchlist.com/s/bexITC"
            method="POST"
          >
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              className="flex-grow bg-white focus:border-rose-500 focus:ring-rose-500"
              required
            />
            <Button
              type="submit"
              className="bg-rose-500 text-white hover:bg-rose-600"
            >
              join the waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 text-xs text-zinc-500">
            <span className="font-medium">183 people</span> already on the waitlist. You're in good company.
          </p>
        </div>

        {/* Social proof */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">what early testers are saying:</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="mb-2 text-zinc-700">
                "This is exactly what I needed. I have so many articles saved that I never get around to reading."
              </p>
              <p className="text-sm font-medium text-zinc-500">- Alex, grad student</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="mb-2 text-zinc-700">
                "The queue feature is a game changer. I listen to articles while walking my dog now."
              </p>
              <p className="text-sm font-medium text-zinc-500">- Jamie, software dev</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mb-10 rounded-xl border-2 border-dashed border-rose-300 bg-white p-6 text-center">
          <p className="mb-4 text-lg font-medium">
            That's it. No fancy marketing BS. Just a useful tool I think you'll like.
          </p>
          <Button
            onClick={() => document.querySelector('input[type="email"]')?.scrollIntoView({ behavior: "smooth" })}
            className="bg-rose-500 text-white hover:bg-rose-600"
          >
            Get on the waitlist
          </Button>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
          <p>FlowRead &copy; {new Date().getFullYear()} &bull; Made by <a href="https://twitter.com/elliottinpublic" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500">@elliottinpublic</a> with ❤️ in public</p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="https://twitter.com/elliottinpublic" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500">
              Follow @elliottinpublic on X
            </a>
            {/* Optional: Add other links here if you want, e.g., a contact email or different social media */}
          </div>
        </footer>
      </main>
    </div>
  )
}
