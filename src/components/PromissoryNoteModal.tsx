import React from 'react'

import MyModal from './modals/common/Modal'

const PromissoryNoteModal = ({
  close,
  content,
  isOpen,
  issuer,
  promissoryLink,
}: {
  close: () => void
  content: string
  isOpen: boolean
  issuer: string
  promissoryLink: string
}) => {
  return (
    <MyModal blockBackdropDismiss hideCloseIcon isOpen={isOpen} onDismiss={close}>
      <div className="mt-2 space-y-6 text-center">
        <h1 className="text-xl font-medium text-[#E0E0E0]">Signed Promissory Note</h1>
        <div className="space-y-4 text-left text-[#D6D6D6]">
          <p>
            <pre className="-ml-2 text-sm">{issuer}</pre>
          </p>
          <p>
            Has{' '}
            <a
              className="text-[#6CADFB] hover:underline"
              href={promissoryLink}
              rel="noreferrer"
              target="_blank"
            >
              Signed
            </a>{' '}
            a promissory note with the following contents.
          </p>
          <p>
            <pre className="max-h-64 max-w-6xl overflow-auto">{content}</pre>
          </p>
          <p>
            Learn more about our credit enhancers{' '}
            <a
              className="text-[#6CADFB] hover:underline"
              href="https://docs.arbor.finance/participants/borrowers/credit-enhancers"
              rel="noreferrer"
              target="_blank"
            >
              here
            </a>
            .
          </p>
        </div>

        <div className="space-x-4">
          <button
            className="btn btn-sm h-[41px] w-[170px] bg-[#1C701C] font-normal normal-case text-white hover:bg-[#1C701C]/80"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </MyModal>
  )
}

export default PromissoryNoteModal
