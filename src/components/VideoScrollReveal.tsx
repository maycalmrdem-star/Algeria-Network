import React from 'react';
import { ContainerScroll } from './ui/container-scroll-animation';

export function VideoScrollReveal() {
  return (
    <section className="w-full relative z-20 bg-black">
      {/* Mobile view: Standard video display without scroll effects */}
      <div className="md:hidden w-full px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-6">استمتع بتجربة لا مثيل لها</h2>
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(88,101,242,0.15)] border border-white/10">
          <video 
            src="/assets/dynamic-music-app-launch.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
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
