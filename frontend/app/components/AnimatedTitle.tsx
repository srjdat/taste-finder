'use client';

import { useEffect, useState } from 'react';

type Props = {
    text: string; 
}

export default function AnimatedTitle( { text }: Props ) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <label className="font-mono text-3xl text-center w-full block" htmlFor="input">
      {text.slice(0, visibleCount)}
    </label>
  );
}