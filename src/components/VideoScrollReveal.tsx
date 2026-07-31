import React from 'react';
import { ContainerScroll } from './ui/container-scroll-animation';

export function VideoScrollReveal() {
  return (
    <section className="w-full relative z-20 bg-black">
      {/* Mobile view: Standard video display without scroll effects */}
      <div className="md:hidden w-full px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-6">استمتع بتجربة لا مثيل لها</h2>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden z-10">
          <div className="absolute -inset-2 bg-gradient-to-tr from-[#5865F2] via-purple-500 to-pink-500 opacity-40 blur-[40px] animate-pulse -z-10 rounded-[30px]" />
          <video 
            src="/assets/dynamic-music-app-launch.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover rounded-2xl relative z-10"
          />
        </div>
      </div>

      {/* Desktop view: Aceternity Container Scroll effect */}
      <div className="hidden md:flex flex-col overflow-hidden pb-[100px] pt-[50px] w-full">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-white">
                استمتع بتجربة <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-[#5865F2]">
                  لا مثيل لها
                </span>
              </h1>
            </>
          }
        >
          <video 
            src="/assets/dynamic-music-app-launch.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            className="mx-auto rounded-2xl object-cover h-full object-center w-full"
          />
        </ContainerScroll>
      </div>
    </section>
  );
}
