"use client"

import React, { useEffect } from "react"
import { ArrowRight, Headphones, Brain, Coffee, Sparkles, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'

export default function Home() {
  useEffect(() => {
    const heroEmailInput = document.querySelector('section.flex input[name="email"]');
    if (heroEmailInput) {
      (heroEmailInput as HTMLInputElement).focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <header className="container mx-auto mb-8 flex max-w-2xl items-center justify-between px-4 py-8">
        <div className="flex items-center gap-2">
          <Image src="/flowread-logo.png" alt="FlowRead Logo" width={32} height={32} className="h-8 w-8" />
          <span className="font-semibold text-lg">FlowRead</span>
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

      <section className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center text-center container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-4 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-800 shadow-sm">
          Nice. You found it.
        </div>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
          Too Much Text? Just Listen to It.
        </h1>
        <p className="mb-8 text-lg text-zinc-700 md:text-xl">
          Finally, a way to actually get through your reading list.
        </p>
        <form
          className="launchlist-form flex w-full max-w-md flex-col items-center gap-3 sm:flex-row"
          action="https://getlaunchlist.com/s/bexITC"
          method="POST"
          // @ts-ignore - Adding raw HTML attribute if not in TS types
          referrerpolicy="no-referrer-when-downgrade"
        >
          <Input
            type="email"
            name="email"
            placeholder="your@email.com"
            className="w-full flex-grow bg-white focus:border-rose-500 focus:ring-rose-500 sm:w-auto"
            required
          />
          <Button
            type="submit"
            variant="default" // Assuming 'default' is your primary button style
            className="w-full bg-rose-500 text-white hover:bg-rose-600 sm:w-auto"
          >
            Lemme Know When It Drops <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </section>

      <main className="container mx-auto max-w-2xl px-4 py-8">
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
            <Image src="/ElliottTong.png" alt="Elliott Tong" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="font-medium">why I'm making this</p>
              <p className="text-sm text-zinc-500">the honest truth</p>
            </div>
          </div>
          <p className="mb-6 text-zinc-700 font-bold">
            I was drowning in information...
          </p>
          <p className="mb-6 text-zinc-700">
            Between work articles, tech docs, and interesting reads, I was paying for multiple apps trying to keep up - but nothing quite worked.
          </p>
          <p className="mb-6 text-zinc-700">
            I'd read something, think "this is important," and then... poof. Gone from my brain.
          </p>
          
          <p className="mb-6 text-zinc-700 font-bold">
            So I started building FlowRead for myself.
          </p>
          <p className="mb-6 text-zinc-700">
            When I showed it to friends, their reaction was immediate: "Why doesn't this exist already?" and "I need this yesterday."
          </p>
          <p className="mb-6 text-zinc-700">
            That's when I knew I wasn't alone in this struggle.
          </p>
          
          <p className="mb-6 text-zinc-700">
            I'm not here to build the next unicorn.
          </p>
          <p className="mb-6 text-zinc-700">
            I just want to solve a real problem in a way that actually works.
          </p>
          <p className="mb-6 text-zinc-700 font-bold">
            No fluff, no BS - just a tool that helps you learn and remember more of what matters.
          </p>

          {/* Option 3: Integrated Social Links in Personal Note */}
          <div className="mt-6 mb-6 border-t border-zinc-200 pt-4">
            <p className="mb-3 text-sm text-zinc-600 font-bold"> Elliott Tong, creator of FlowRead</p>
            <p className="mb-3 text-sm text-zinc-600">Follow my progress (and occasional meltdowns):</p>
            <div className="flex items-center justify-left gap-4">
              <a href="https://x.com/ElliottInPublic" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500"><Twitter className="h-5 w-5" /></a>
              <a href="https://www.instagram.com/elliott.tong/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500"><Instagram className="h-5 w-5" /></a>
              <a href="https://www.linkedin.com/in/elliott-tong/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500"><Linkedin className="h-5 w-5" /></a>
              <a href="https://www.tiktok.com/@elliott.tong" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-rose-500">TikTok</a>
            </div>
          </div>
          

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
          <h2 className="mb-4 text-xl font-semibold">Real Talk on the Beta</h2>
          <p className="mb-4 text-zinc-700">
            Alright, here's the deal with the FlowRead beta, coming this June: It's gonna be totally free to use.
          </p>
          <p className="mb-4 text-zinc-700">
            This is an early MVP (Minimum Viable Product) release. That means the core text-to-audio will be solid and hopefully make your life easier straight away. But, full disclosure, it won't have all the bells and whistles I'm dreaming up just yet – stuff like AI summaries or a massive built-in library will come later.
          </p>
          <p className="mb-4 text-zinc-700">
            The fancy natural-sounding voices? You'll get to use them, but there'll be a pretty generous weekly limit. Reason being, they cost me a bit to run, and I want to keep the main experience free for as many folks as possible during the beta.
          </p>
          <p className="text-zinc-700">
            My main goal right now is to get this into your hands, see how you use it, and build something genuinely useful based on your feedback. No hype, just a tool I hope you'll love.
          </p>
        </div>

        {/* Social proof */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">hear what early users love</h2>
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
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              // Slight delay to ensure scrolling has initiated before focus
              setTimeout(() => {
                const heroEmailInput = document.querySelector('section.flex input[name="email"]');
                if (heroEmailInput) {
                  (heroEmailInput as HTMLInputElement).focus();
                }
              }, 300); // Adjust delay if needed, or use a promise with scrollend event if browsers support it widely
            }}
            className="bg-rose-500 text-white hover:bg-rose-600"
          >
            Get on the waitlist
          </Button>
        </div>
      </main>

      <footer className="bg-zinc-100 py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-zinc-600">
            made with ❤️ in public by{" "}
            <a
              href="https://twitter.com/elliottinpublic"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-rose-500 hover:text-rose-600"
            >
              @elliottinpublic
            </a>
          </p>
          {/* Option 1: Enhanced Footer Links */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <a href="https://www.instagram.com/elliott.tong/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500"><Instagram className="h-5 w-5" /></a>
            <a href="https://www.linkedin.com/in/elliott-tong/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500"><Linkedin className="h-5 w-5" /></a>
            <a href="https://www.tiktok.com/@elliott.tong" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-rose-500">TikTok</a>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            FlowRead - Helping you conquer your reading list, one audio at a time.
          </p>
        </div>
      </footer>
    </div>
  )
}
