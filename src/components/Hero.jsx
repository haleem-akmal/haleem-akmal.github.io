// src/components/Hero.jsx
import React from 'react';
import HeroBg from '../assets/hero-bg.jpg';
import Headshot from '../assets/headshot.jpg';
import { FiArrowRight, FiDownload } from 'react-icons/fi';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative isolate min-h-screen flex flex-col justify-center items-center text-white p-4 pt-24 md:pt-4 pb-40 md:pb-4"
    >
      {/* Background Image + Overlays */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${HeroBg})` }}
        aria-hidden="true"
      />
      {/* Dim layer */}
      <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      {/* Radial highlight near text side */}
      <div
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            'radial-gradient(60% 50% at 30% 45%, rgba(124,58,237,0.18) 0%, rgba(0,0,0,0) 60%)',
        }}
        aria-hidden="true"
      />
      {/* Optional noise for banding (can remove if you don’t like) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
        {/* Left: Text */}
        <div className="xl:ps-8 md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
          {/* Tiny role badge (optional) */}
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-gray-200">
            Full‑Stack Developer
          </span>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Hi, I’m
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
              Haleem Akmal
            </span>
          </h1>

          <p
            className="text-base md:text-xl max-w-xl mb-8 text-gray-300 leading-relaxed"
            style={{ textWrap: 'balance' }}
          >
            Full‑Stack Developer crafting beautiful, functional, and user‑centered digital experiences
          </p>

<div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto sm:mx-0">
  <a 
    href="#projects" 
    className="group flex items-center justify-center bg-purple-600 text-white 
               px-5 sm:px-6 py-3 rounded-md font-semibold 
               hover:bg-purple-700 hover:shadow-[0_0_12px_rgba(168,85,247,0.5)] 
               hover:scale-105 active:scale-95 transition-transform duration-300 
               w-full sm:w-48 text-sm sm:text-base"
  >
    View My Work
    <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
  </a>

  <a
    href="/cv.pdf"
    download
    aria-label="Download my CV"
    className="group flex items-center justify-center text-gray-300 
               px-5 sm:px-6 py-3 rounded-md font-semibold
               hover:bg-white/10 hover:text-white motion-safe:hover:scale-[1.03] 
               active:scale-95 transition-transform duration-300 
               w-full sm:w-48 text-sm sm:text-base
               focus-visible:outline-none focus-visible:ring-2 
               focus-visible:ring-purple-500/70 focus-visible:ring-offset-2 
               focus-visible:ring-offset-black/40"
  >
    <FiDownload className="mr-2 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
    Download CV
  </a>
</div>
        </div>

        {/* Right: Headshot */}
        <div className="md:w-1/2 flex justify-center order-1 md:order-2">
          <img
            src={Headshot}
            alt="Haleem Akmal headshot"
            loading="eager"
            decoding="async"
            draggable="false"
            className="w-55 h-55 md:w-80 md:h-80 xl:w-[28rem] xl:h-[28rem] object-cover rounded-full
                       border border-white/10 ring-1 ring-white/10 shadow-2xl shadow-black/60"
          />
        </div>
      </div>

      {/* Stats Section (left as-is, just minor motion-safety on scroll cue) */}
      <div className="absolute bottom-10 left-0 right-0 z-10 flex flex-col items-center gap-6">
        {/* <div className="flex justify-center gap-4 sm:gap-8 md:gap-12">
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl font-bold text-sky-400">50+</h3>
            <p className="text-xs md:text-base text-gray-400">Projects</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl font-bold text-sky-400">5+</h3>
            <p className="text-xs md:text-base text-gray-400">Experience</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl font-bold text-sky-400">30+</h3>
            <p className="text-xs md:text-base text-gray-400">Clients</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl font-bold text-sky-400">24/7</h3>
            <p className="text-xs md:text-base text-gray-400">Support</p>
          </div>
        </div> */}
        <div>
        <div className='hidden sm:block' >
            <div className="w-7 h-12 border-2 border-gray-400 rounded-full flex justify-center items-start p-1">
                <div className="w-1 h-3 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;