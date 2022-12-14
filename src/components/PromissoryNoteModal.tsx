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
          <div className="card-bordered card">
            <div className="card-body p-4">
              <div className="flex flex-row items-center space-x-2">
                <svg
                  fill="none"
                  height="14"
                  viewBox="0 0 15 14"
                  width="15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M7.801 14C11.7702 14 14.9879 10.866 14.9879 7C14.9879 3.13401 11.7702 0 7.801 0C3.83179 0 0.614105 3.13401 0.614105 7C0.614105 10.866 3.83179 14 7.801 14ZM6.80125 3.52497C6.78659 3.23938 7.02037 3 7.31396 3H8.28804C8.58162 3 8.81541 3.23938 8.80075 3.52497L8.59541 7.52497C8.58175 7.79107 8.35625 8 8.0827 8H7.5193C7.24575 8 7.02025 7.79107 7.00659 7.52497L6.80125 3.52497ZM6.7743 10C6.7743 9.44772 7.23397 9 7.801 9C8.36803 9 8.8277 9.44772 8.8277 10C8.8277 10.5523 8.36803 11 7.801 11C7.23397 11 6.7743 10.5523 6.7743 10Z"
                    fill="#EDA651"
                    fillRule="evenodd"
                  />
                </svg>
                <span className="text-[#EDA651]">Warning</span>
              </div>
              <div className="text-sm text-[#9F9F9F]">
                Although the DAO has agreed to unconditionally repay, there is no legal recourse in
                the case of default.
              </div>
            </div>
          </div>
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
