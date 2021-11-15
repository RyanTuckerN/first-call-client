import React, { FunctionComponent } from "react";

interface ArrowProps {
  borderColor: string;
  fillColor: string;
}

export default function Arrow({ borderColor, fillColor }: ArrowProps) {
  return (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <g>
        <title>Layer 1</title>
        <path
          stroke={borderColor}
          id="svg_7"
          d="m2.28487,10.05096l7.71513,-8.58469l7.71513,8.58469l-3.85757,0l0,8.62599l-7.71513,0l0,-8.62599l-3.85757,0z"
          fill={fillColor}
        />
      </g>
    </svg>
  );
}
