import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

interface CreatePanelProps {
  panels: {
    url: string
    icon: ReactElement
    title: string
    description: string
    learn: string
    disabled?: boolean
  }[]
}

export const CreatePanel = ({ panels }: CreatePanelProps) => {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex items-stretch justify-center space-x-8">
        {panels.map((panel, i) => (
          <div
            className={`card flex !h-full w-[326px] cursor-pointer grayscale-0 transition-all hover:border-gray-600 ${
              panel.disabled ? 'cursor-not-allowed hover:grayscale' : ''
            }`}
            key={i}
            onClick={() => (!panel.disabled ? navigate(panel.url) : null)}
          >
            <div className="card-body">
              <div>{panel.icon}</div>

              <div className="text-3xl font-medium text-white">{panel.title}</div>
              <p className="text-[#696969]">{panel.description}</p>
              <a
                className="btn btn-sm mt-4 flex self-start !border-[#2A2B2C] bg-[#181A1C] !text-2sm font-normal normal-case text-white"
                href={panel.learn}
                onClick={(e) => {
                  e.stopPropagation()
                }}
                rel="noreferrer"
                target="_blank"
              >
                Learn more
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
