'use client';

import React from 'react';
import { 
  Root as SliderRoot,
  Track as SliderTrack,
  Range as SliderRange,
  Thumb as SliderThumb 
} from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderRoot
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderTrack className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderRange className="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderRoot>
));
Slider.displayName = 'Slider';

export { Slider };