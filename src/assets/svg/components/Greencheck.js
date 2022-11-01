import * as React from 'react'
const SvgGreencheck = (props) => (
  <svg fill="none" height={136} width={136} xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#greencheck_svg__a)">
      <circle cx={68} cy={60} r={52} />
      <circle cx={68} cy={60} r={51.5} stroke="#1C701C" />
    </g>
    <path d="m46 60 14.5 14.5L90 45" stroke="#1C701C" strokeWidth={2} />
    <defs>
      <filter
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height={136}
        id="greencheck_svg__a"
        width={136}
        x={0}
        y={0}
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={8} />
        <feGaussianBlur stdDeviation={8} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.356863 0 0 0 0 0.803922 0 0 0 0 0.533333 0 0 0 0.08 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_9561_3829" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={0.5} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.356863 0 0 0 0 0.803922 0 0 0 0 0.533333 0 0 0 1 0" />
        <feBlend in2="effect1_dropShadow_9561_3829" result="effect2_dropShadow_9561_3829" />
        <feBlend in="SourceGraphic" in2="effect2_dropShadow_9561_3829" result="shape" />
      </filter>
    </defs>
  </svg>
)
export default SvgGreencheck
