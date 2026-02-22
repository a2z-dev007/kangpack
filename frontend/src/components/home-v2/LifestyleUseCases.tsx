'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ASSETS } from '@/constants/assets';

const scenes = [
  { img: ASSETS.TICKERS.IMG_354A7756, title: 'The City Streets' },
  { img: ASSETS.TICKERS.IMG_354A7767, title: 'The Transit Lounge' },
  { img: ASSETS.TICKERS.IMG_354A7724, title: 'The Job Site' },
  { img: ASSETS.TICKERS.SIDE, title: 'The Open Road' },
  { img: ASSETS.TICKERS.MAIN, title: 'The Modern Campus' },
];

export default function LifestyleUseCases() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ['1%', '-85%']);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute top-10 left-10 md:left-24 z-20">
          <h2 className="text-4xl md:text-6xl font-black text-white mix-blend-difference mb-2">Designed for Any Environment.</h2>
          <p className="text-xl text-neutral-300 mix-blend-difference">Your work doesn't stop. Neither should your desk.</p>
        </div>

        <motion.div style={{ x }} className="flex gap-8 px-10 md:px-24 mt-32 h-[60vh]">
          {scenes.map((scene, i) => (
            <div
              key={i}
              className="relative w-[80vw] md:w-[60vw] h-full rounded-2xl overflow-hidden shadow-2xl shrink-0 group"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition duration-500 z-10" />
              <img
                src={scene.img}
                alt={scene.title}
                className="absolute inset-0 w-full h-full object-cover rounded-2xl transform scale-100 group-hover:scale-105 transition duration-700"
              />
              <div className="absolute bottom-8 left-8 z-20">
                <h3 className="text-3xl text-white font-bold drop-shadow-lg">{scene.title}</h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
