import React, { useState } from 'react'

import { ErrorMessage } from '@hookform/error-message'
import { CrossCircledIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { FormProvider, useForm } from 'react-hook-form'

import { ActionButton } from '../auction/Claimer'
import { IssuerAllowList } from './SelectableTokens'

import { isRinkeby } from '@/connectors'
import { useActiveWeb3React } from '@/hooks'
import { useWalletModalToggle } from '@/state/application/hooks'

export const FormSteps = ({
  ActionSteps,
  Summary,
  color = 'blue',
  convertible = true,
  midComponents,
  steps,
  title,
}) => {
  const [currentStep, setCurrentStep] = useState(0)

  const methods = useForm({
    mode: 'onChange',
  })
  const {
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = methods

  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const onSubmit = (data) => console.log('onSubmit', data)
  const totalErrors = Object.keys(errors).length

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isRinkeby && !IssuerAllowList.includes(account?.toLowerCase()) && (
          <div className="w-full">
            <div className="rounded-md border-l-4 border-red-400 bg-red-50 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="space-x-1 text-sm text-red-700">
                    <span>
                      Your address it not on the issuer allow list. You will not be able to submit
                      this form.
                    </span>
                    <a
                      className="font-medium text-red-700 underline hover:text-red-600"
                      href="https://forms.gle/NaLa8GV4eBJSAx9s7"
                    >
                      Request access
                    </a>
                    <span>or</span>
                    <a
                      className="font-medium text-red-700 underline hover:text-red-600"
                      href="https://rinkeby.arbor.garden/"
                    >
                      Continue on Rinkeby
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-8">
          <div className="card w-[326px] overflow-visible">
            <div className="card-body">
              <div className="flex items-center space-x-4 border-b border-[#2C2C2C] pb-4">
                <DoubleArrowRightIcon
                  className={`h-6 w-6 rounded-md border border-[#ffffff22] p-1 ${
                    color === 'blue' ? 'bg-[#0F5156]' : 'bg-[#236245]'
                  }`}
                />
                <span className="text-xs uppercase text-white">{title}</span>
              </div>

              <ul className="steps steps-vertical">
                {steps.map((step, i) => (
                  <li
                    className={`step ${
                      i <= currentStep
                        ? `step-${
                            color === 'purple' ? 'primary' : 'secondary'
                          } hover:cursor-pointer hover:underline`
                        : ''
                    }`}
                    key={i}
                    onClick={() => {
                      if (i !== currentStep && i <= currentStep) setCurrentStep(i)
                    }}
                  >
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card w-[425px] overflow-visible">
            <div className="card-body">
              <h1 className="card-title !text-2xl">{steps[currentStep]}</h1>
              <div className="space-y-4">
                {!account && (
                  <ActionButton className="mt-4" color={color} onClick={toggleWalletModal}>
                    Connect wallet
                  </ActionButton>
                )}

                {account && (
                  <>
                    {midComponents[currentStep]}

                    {currentStep < steps.length - 1 && (
                      <ActionButton
                        color={color}
                        disabled={!isValid || !isDirty}
                        onClick={() => setCurrentStep(currentStep + 1)}
                        type="submit"
                      >
                        Continue
                      </ActionButton>
                    )}
                    {currentStep === steps.length - 1 && (
                      <ActionSteps
                        convertible={convertible}
                        disabled={!isRinkeby && !IssuerAllowList.includes(account.toLowerCase())}
                      />
                    )}

                    {totalErrors ? (
                      <div className="rounded-md bg-red-100 p-4">
                        <div className="flex">
                          <div className="shrink-0">
                            <CrossCircledIcon className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              There {totalErrors > 1 ? `were ${totalErrors} errors` : `is an error`}{' '}
                              with your submission
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                              <ul className="list-disc space-y-1 pl-5" role="list">
                                {Object.keys(errors).map((name) => (
                                  <ErrorMessage
                                    errors={errors}
                                    key={name}
                                    name={name}
                                    render={({ message }) => <li>{message}</li>}
                                  />
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
          {currentStep >= 1 && <Summary currentStep={currentStep} />}
        </div>
      </form>
    </FormProvider>
  )
}
