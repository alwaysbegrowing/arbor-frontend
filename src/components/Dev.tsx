import React from 'react'

// export const isDev = process.env.NODE_ENV === 'development'
// Disable the dev data and state changes
export const isDev = false

const Dev = ({ children }) =>
  !isDev ? null : (
    <div className="mt-8 mockup-code bg-primary text-primary-content">
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  )

export default Dev