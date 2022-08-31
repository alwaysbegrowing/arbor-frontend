import React, { Fragment } from 'react'

import { Listbox, Transition } from '@headlessui/react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useFormContext, useWatch } from 'react-hook-form'

import { BorrowTokens } from '../SelectableTokens'

import { requiredChain } from '@/connectors'

const BorrowToken = ({ option }) => (
  <span className="flex items-center space-x-4 py-3 px-4 text-xs" key={option?.name}>
    {option?.icon?.()}
    <span>{option?.name || 'Pick a token'}</span>
  </span>
)

export const Selector = ({ OptionEl, disabled = false, name, options }) => {
  // We assume `options` will have "name" key
  const { register, setValue } = useFormContext()
  const fieldValue = useWatch({ name })
  const selected = options?.find(
    (o) =>
      (o?.address && o?.address === fieldValue?.address) || (o?.id && o?.id === fieldValue?.id),
  )
  const setList = (e) => {
    setValue(name, e, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <Listbox disabled={disabled} onChange={setList} value={selected}>
      <input
        className="hidden"
        readOnly
        {...register(name, { required: 'A borrow token must be selected' })}
        defaultValue={selected?.address || selected?.id}
      />
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-[#2A2B2C] bg-transparent pr-4 text-left text-sm text-white shadow-md">
          {!selected?.address && !selected?.id ? (
            <OptionEl option={null} />
          ) : (
            <>
              <OptionEl option={selected} />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <CaretSortIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
              </span>
            </>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 max-h-64 w-full overflow-auto rounded-lg border border-[#2A2B2C] bg-[#1F2123] shadow ring-1 ring-black ring-opacity-5 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800 focus:outline-none">
            {options?.map((option, optionIdx) => (
              <Listbox.Option
                className={({ active }) =>
                  `cursor-pointer relative select-none text-white hover:bg-zinc-800 ${
                    active ? 'bg-zinc-800' : ''
                  }`
                }
                key={optionIdx}
                value={option}
              >
                {({ selected }) => (
                  <>
                    <OptionEl option={option} />
                    {selected ? (
                      <span className="absolute inset-y-0 right-2 flex items-center pl-3 text-[#293327]">
                        <CheckIcon aria-hidden="true" className="h-5 w-5" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

const BorrowTokenSelector = () => {
  return (
    <Selector OptionEl={BorrowToken} name="borrowToken" options={BorrowTokens[requiredChain?.id]} />
  )
}

export default BorrowTokenSelector
