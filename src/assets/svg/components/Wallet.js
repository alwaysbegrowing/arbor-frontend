import * as React from 'react'
const SvgWallet = (props) => (
  <svg fill="none" height={50} width={53} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1 14.532a4 4 0 0 1 2.92-3.851l33-9.256C39.47.709 42 2.627 42 5.276v29.692a4 4 0 0 1-2.92 3.851l-33 9.256C3.53 48.791 1 46.873 1 44.224V14.532Z"
      stroke="#E3E3E3"
      strokeMiterlimit={10}
    />
    <path
      d="M1 15.5a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4v-30Z"
      stroke="#E3E3E3"
      strokeMiterlimit={10}
    />
    <path
      d="M30 30.5a7 7 0 0 1 7-7h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H37a7 7 0 0 1-7-7Z"
      stroke="#E3E3E3"
      strokeMiterlimit={10}
    />
    <circle cx={44} cy={30.5} r={3} stroke="#E3E3E3" strokeMiterlimit={10} />
  </svg>
)
export default SvgWallet
