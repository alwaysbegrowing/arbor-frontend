import * as React from 'react'

function SimpleCreateIcon(props) {
  return (
    <svg
      fill="none"
      height="84"
      viewBox="0 0 84 84"
      width="84"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_9565_6481)">
        <rect fill="#406de0" height="64" rx="16" width="64" x="10" />
        <rect
          height="63"
          rx="15.5"
          stroke="#E0E0E0"
          strokeOpacity="0.2"
          width="63"
          x="10.5"
          y="0.5"
        />
      </g>
      <rect height="31.25" stroke="#E0E0E0" strokeWidth="2" width="31.25" x="26.375" y="16.375" />
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="84"
          id="filter0_d_9565_6481"
          width="84"
          x="0"
          y="0"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
          <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_9565_6481" />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_9565_6481"
            mode="normal"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}

const MemoSimpleCreateIcon = React.memo(SimpleCreateIcon)
export default MemoSimpleCreateIcon
