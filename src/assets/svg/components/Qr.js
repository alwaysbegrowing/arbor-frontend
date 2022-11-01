import * as React from 'react'
const SvgQr = (props) => (
  <svg fill="none" height={21} width={21} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      clipRule="evenodd"
      d="M7.5 1.5h-6v6h6v-6ZM1.5 0H0v9h9V0H1.5Zm3 3H3v3h3V3H4.5Zm-3 16.5v-6h6v6h-6ZM0 12h9v9H0v-9Zm4.5 3H3v3h3v-3H4.5Zm9-13.5h6v6h-6v-6ZM12 0h9v9h-9V0Zm4.5 3H15v3h3V3h-1.5Zm0 9H12v9h1.5v-4.5H15V18h6v-6h-1.5v1.5h-3V12Zm1.5 7.5h-1.5V21H18v-1.5Zm1.5 0H21V21h-1.5v-1.5Z"
      fill="#000"
      fillRule="evenodd"
    />
  </svg>
)
export default SvgQr
