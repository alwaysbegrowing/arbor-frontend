import React, { useState } from 'react'

import { ErrorMessage } from '@hookform/error-message'
import { CrossCircledIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { FormProvider, useForm } from 'react-hook-form'

import { IssuerAllowList } from '@/components/ProductCreate/SelectableTokens'
import { ActionButton } from '@/components/auction/Claimer'
import { isGoerli } from '@/connectors'
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
        <div className="flex justify-center space-x-8">
          <div className="card w-[326px] overflow-visible">
            <div className="card-body">
              <div className="flex items-center space-x-4 border-b border-[#2C2C2C] pb-4">
                <DoubleArrowRightIcon
                  className={`h-6 w-6 rounded-md border border-[#ffffff22] p-1 ${
                    color === 'blue' ? 'bg-[#1C701C]' : 'bg-[#293327]'
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
                        Sign
                      </ActionButton>
                    )}
                    {currentStep === steps.length - 1 && (
                      <ActionSteps
                        convertible={convertible}
                        disabled={!isGoerli && !IssuerAllowList.includes(account.toLowerCase())}
                      />
                    )}

                    {totalErrors ? (
                      <div className="rounded-md bg-zinc-800 p-4">
                        <div className="flex">
                          <div className="shrink-0">
                            <CrossCircledIcon className="h-5 w-5 text-red-800" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium">
                              There {totalErrors > 1 ? `were ${totalErrors} errors` : `is an error`}{' '}
                              with your submission
                            </h3>
                            <div className="mt-2 text-sm">
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

                    {!isGoerli && !IssuerAllowList.includes(account?.toLowerCase()) && (
                      <div className="rounded-md bg-zinc-800 p-4">
                        <div className="flex">
                          <div className="shrink-0">
                            <CrossCircledIcon className="h-5 w-5 text-red-800" />
                          </div>
                          <div className="ml-3">
                            <p className="space-x-1 text-sm ">
                              <span>
                                Your address it not on the issuer allow list. You will not be able
                                to submit this form.
                              </span>
                              <a
                                className="font-medium  underline"
                                href="https://forms.gle/6H8eHWF4E8vHfLNp8"
                              >
                                Request access
                              </a>
                              <span>or</span>
                              <a
                                className="font-medium  underline"
                                href="https://goerli.arbor.finance/"
                              >
                                Continue on Görli
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
