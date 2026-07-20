import React, { useState, useEffect } from 'react';

export function BreakerSymbol({ poles }: { poles: 'SP' | 'DP' | 'TP' | 'FP' }) {
  return (
    <svg className="w-5.5 h-5.5 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {/* Terminals */}
      <circle cx="12" cy="4" r="1" fill="currentColor" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
      {/* Breaker switch link */}
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      {/* Slanted switch contact representing circuit breaker state */}
      <line x1="12" y1="16" x2="6" y2="7" />
      {/* Thermal overload representation */}
      <path d="M 12 16 Q 15 14 12 12" strokeWidth="1.5" strokeDasharray="1,1" />
      {/* Number of poles tag */}
      <text x="17" y="14" fontSize="7" className="fill-zinc-500 font-bold font-sans" stroke="none">{poles}</text>
    </svg>
  );
}

interface AutoScalingContainerProps {
  children: React.ReactNode;
  standardWidth?: number;
  className?: string;
  disableScale?: boolean;
}

export function AutoScalingContainer({ 
  children, 
  standardWidth = 840, 
  className = '',
  disableScale = false
}: AutoScalingContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (disableScale) {
      setScale(1);
      return;
    }
    if (!containerRef.current) return;

    const updateScale = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (container && content) {
        const containerWidth = container.clientWidth;
        const newScale = containerWidth < standardWidth ? containerWidth / standardWidth : 1;
        setScale(newScale);
        setContentHeight(content.scrollHeight);
      }
    };

    updateScale();
    
    // Slight delay to allow initial layout pass
    const timer = setTimeout(updateScale, 100);

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    observer.observe(containerRef.current);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [disableScale, standardWidth]);

  if (disableScale) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      ref={containerRef} 
      className={`w-full overflow-hidden relative ${className}`}
      style={{
        height: scale < 1 ? `${contentHeight * scale}px` : 'auto',
        transition: 'height 0.1s ease-out'
      }}
    >
      <div
        ref={contentRef}
        style={{
          transform: scale < 1 ? `scale(${scale})` : 'none',
          transformOrigin: 'top left',
          width: `${standardWidth}px`,
          position: scale < 1 ? 'absolute' : 'relative',
          top: 0,
          left: 0
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function IncomingSourceSymbol() {
  return (
    <svg className="w-7 h-7 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {/* Interlocking winding circles representing transformer source */}
      <circle cx="12" cy="9" r="5" />
      <circle cx="12" cy="15" r="5" strokeDasharray="2,1" />
      <path d="M 12 6 L 12 11 M 9 16 L 12 14 L 15 16" />
    </svg>
  );
}
