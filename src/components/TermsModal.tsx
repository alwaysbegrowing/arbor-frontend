import React from 'react'

import MyModal from './modals/common/Modal'

const TermsModal = ({
  abortModal,
  acceptTerms,
  close,
  isOpen,
}: {
  close: () => void
  isOpen: boolean
  abortModal: () => void
  acceptTerms: () => void
}) => {
  console.log({ isOpen })
  return (
    <MyModal blockBackdropDismiss hideCloseIcon isOpen={isOpen} onDismiss={close}>
      <div className="mt-2 space-y-6 text-center">
        <h1 className="text-xl font-medium text-[#E0E0E0]">Terms of Service</h1>
        <div className="space-y-4 text-left text-[#D6D6D6]">
          <p>
            Please read our{' '}
            <a
              className="text-[#6CADFB] hover:underline"
              href="/pdf/Arbor_Terms_and_Conditions_.pdf"
              rel="noreferrer"
              target="_blank"
            >
              Terms of Service
            </a>{' '}
            and review the list of restricted countries Arbor protocol does not serve. If you live
            in one of the restricted countries, you will not be able to use the Arbor protocol.
          </p>

          <p>
            By clicking “Accept” you agree to our{' '}
            <a
              className="text-[#6CADFB] hover:underline"
              href="/pdf/Arbor_Terms_and_Conditions_.pdf"
              rel="noreferrer"
              target="_blank"
            >
              Terms of Service
            </a>{' '}
            and confirm you do not live in one of the restricted countries Arbor does not serve.
          </p>
        </div>

        <div className="space-x-4">
          <button
            className="btn-sm btn h-[41px] w-[170px] bg-[#1C701C] font-normal normal-case text-white hover:bg-[#1C701C]/80"
            onClick={acceptTerms}
          >
            Accept
          </button>
          <button
            className="btn-sm btn h-[41px] w-[170px] bg-[#696969] font-normal normal-case text-white hover:bg-gray-500"
            onClick={abortModal}
          >
            Decline
          </button>
        </div>
      </div>
    </MyModal>
  )

  return null
}

export default TermsModal
