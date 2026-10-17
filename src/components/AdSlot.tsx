import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
  label?: string;
}

const AD_CLIENT = (import.meta as any).env?.VITE_AD_CLIENT || '';

export default function AdSlot({ slot = '0000000000', format = 'auto', className = '', label = 'Advertisement' }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AD_CLIENT) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, []);

  if (!AD_CLIENT) {
    return (
      <div className={`ad-slot ${className}`}>
        <div className="text-center px-4">
          <div className="font-semibold">{label}</div>
          <div className="text-xs mt-1 opacity-70">
            Ad slot placeholder. Set VITE_AD_CLIENT to enable Google AdSense.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} ref={ref}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
