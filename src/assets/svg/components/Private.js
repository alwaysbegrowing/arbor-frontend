import * as React from 'react'
const SvgPrivate = (props) => (
  <svg fill="none" height={20} width={14} xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect fill="#D6D6D6" height={11.6} rx={0.5} stroke="#D6D6D6" width={13} x={0.5} y={7.701} />
    <mask fill="#fff" id="private_svg__a">
      <path d="M2.8 1.201a1 1 0 0 1 1-1h6.4a1 1 0 0 1 1 1v8.8H2.8v-8.8Z" />
    </mask>
    <path
      d="M2.8 1.201a1 1 0 0 1 1-1h6.4a1 1 0 0 1 1 1v8.8H2.8v-8.8Z"
      mask="url(#private_svg__a)"
      stroke="#D6D6D6"
      strokeWidth={3}
    />
    <path d="M5.6 11.4h2.8V17H5.6z" fill="#131415" />
  </svg>
)
export default SvgPrivate
