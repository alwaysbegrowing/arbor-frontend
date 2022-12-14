import React from 'react'

import TooltipElement from '@/components/common/Tooltip'

export const SummaryItem = ({ text, tip = null, title }) => (
  <div className="space-y-2 border-b border-[#2C2C2C] pb-4">
    <div className="text-base text-white">{text}</div>
    <div className="text-xs text-[#696969]">
      <TooltipElement left={title} tip={tip} />
    </div>
  </div>
)
