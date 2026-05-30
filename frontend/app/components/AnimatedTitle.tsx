'use client';

import { useEffect, useState } from 'react';

type Props = {
    text: string; 
}

export default function AnimatedTitle( { text }: Props ) {
  const [visibleCount, setVisibleCount] = useState(0);

  // don't know how it works but it does
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 50); // change that number to make it faster or slower based on what i want later

    return () => clearInterval(interval);
  }, [text]);

  return (
    <label className="font-mono text-3xl text-center w-full block" htmlFor="input">
      {text.slice(0, visibleCount)}
    </label>
  );
}