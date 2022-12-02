import React from 'react'

export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const StepTwo = () => {
  return (
    <>
      <div className="form-control w-full">
        <p>Your order will appear in your portfolio once it has been indexed.</p>
      </div>
    </>
  )
}
