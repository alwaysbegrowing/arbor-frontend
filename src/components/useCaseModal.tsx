import React from 'react'

import MyModal from './modals/common/Modal'

const UseCaseModal = ({
  close,
  isOpen,
  issuer,
  name,
  useCaseInfo,
  useLink,
}: {
  close: () => void
  content: string
  isOpen: boolean
  issuer: string
  name: string
  useCaseInfo: string
  useLink: string
}) => {
  return (
    <MyModal blockBackdropDismiss hideCloseIcon isOpen={isOpen} onDismiss={close}>
      <div className="mt-2 space-y-6 text-center">
        <h1 className="text-xl font-medium text-[#E0E0E0]">{name}&#39;s Plan for Raised Capital</h1>
        <div className="space-y-4 text-left text-[#D6D6D6]">
          <p>
            <pre className="-ml-2 text-sm">{issuer}</pre>
          </p>
          <div className="card-bordered card">
            <div className="card-body p-4">
              <div className="flex flex-row items-center space-x-2">{useCaseInfo}</div>
            </div>
            <div className="card-body p-4">
              <div className="flex flex-row items-center space-x-2">
                Read more about it{' '}
                <em>
                  <a href={useLink} rel="noreferrer" target="_blank">
                    &nbsp;here.
                  </a>
                </em>
              </div>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <button
            className="btn-sm btn h-[41px] w-[170px] bg-[#1C701C] font-normal normal-case text-white hover:bg-[#1C701C]/80"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </MyModal>
  )
}

export default UseCaseModal
