import { FC, ReactNode, useRef } from 'react';

interface TooltipProps {
  children: ReactNode;
  tooltipText: string;
  tooltipClasses?: string;
}

const Tooltip: FC<TooltipProps> = ({
  children,
  tooltipText,
  tooltipClasses,
}) => {
  const tooltipRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="relative inline-block group">
      {children}
      <span
        ref={tooltipRef}
        className={`absolute bottom-[110%] -translate-x-1/2 left-1/2 invisible transition opacity-0 group-hover:visible group-hover:opacity-100 whitespace-nowrap ${tooltipClasses}`}
      >
        {tooltipText}
      </span>
    </div>
  );
};

export default Tooltip;
