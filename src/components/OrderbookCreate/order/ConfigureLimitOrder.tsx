import React from 'react'

import dayjs from 'dayjs'
import { useFormContext } from 'react-hook-form'

import { BondSelector } from '../../ProductCreate/selectors/CollateralTokenSelector'
import { addDays } from './ApproveToken'
import { AllBondsList } from './orderbookTable'

import BorrowTokenSelector from '@/components/ProductCreate/selectors/BorrowTokenSelector'
import TooltipElement from '@/components/common/Tooltip'

export const limitOrderType = {
  Buy: 'Buy',
  Sell: 'Sell',
}
export const ConfigureLimitOrder = () => {
  const { register, watch } = useFormContext()
  const [borrowToken, makerAmount, takerAmount, orderType] = watch([
    'borrowToken',
    'makerAmount',
    'takerAmount',
    'orderType',
  ])

  const isSell = orderType === limitOrderType.Sell

  return (
    <>
      <div className="form-control flex w-full items-center">
        <h2 className="card-title text-base">{`${isSell ? 'Sell' : 'Buy'} bonds for USDC.`}</h2>
        <div className="inline-flex">
          <label className={`btn ${!isSell && 'btn-active'} w-[85px]`} htmlFor="order-buy">
            Buy
          </label>
          <input
            id="order-buy"
            {...register('orderType')}
            className={`btn sr-only ${!isSell && 'btn-active'} w-[85px]`}
            type="radio"
            value={limitOrderType.Buy}
          />
          <label className={`btn ${isSell && 'btn-active'} w-[85px]`} htmlFor="order-sell">
            Sell
          </label>
          <input
            id="order-sell"
            {...register('orderType')}
            className={`btn sr-only ${isSell && 'btn-active'} w-[85px]`}
            type="radio"
            value={limitOrderType.Sell}
          />
        </div>
      </div>
      <div className="form-control w-full">
        <div className="flex items-center"></div>
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Bond</span>}
            tip="Bond you will be trading"
          />
        </label>
        {isSell ? <BondSelector /> : <AllBondsList />}
      </div>

      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Number of bonds</span>}
            tip="Number of bonds you will be trading"
          />
        </label>
        <input
          className="input-bordered input w-full"
          inputMode="numeric"
          min={1}
          placeholder="0"
          type="number"
          {...register('makerAmount', {
            required: 'Some bonds must be traded',
            valueAsNumber: true,
            validate: {
              greaterThanZero: (value) => value > 0 || 'Some bonds must be traded',
            },
          })}
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">Token</span>}
            tip="Token that will be traded"
          />
        </label>
        <BorrowTokenSelector />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <TooltipElement
            left={<span className="label-text">{`Number of ${borrowToken?.name ?? 'Token'}`}</span>}
            tip="Minimum price you are willing to accept per bond"
          />
        </label>
        <input
          className="input-bordered input w-full"
          inputMode="numeric"
          min="0"
          placeholder="0"
          step="0.001"
          type="number"
          {...register('takerAmount', {
            required: 'Bonds cannot be given away for free',
            valueAsNumber: true,
            validate: {
              greaterThanZero: (value) => value > 0 || 'Bonds cannot be given away for free',
            },
          })}
        />
        <div className="form-control mt-4 w-full">
          <label className="label">
            <TooltipElement
              left={<span className="label-text">Order expiration date</span>}
              tip="Date the order must be fulfilled by. If not fulfilled, the order will be expired and removed from the orderbook. This is UTC time."
            />
          </label>
          <input
            className="input-bordered input w-full"
            defaultValue={`${addDays(new Date(), 0).toISOString().substring(0, 10)} 23:59`}
            min={dayjs(new Date()).utc().add(0, 'day').format('YYYY-MM-DD HH:mm')}
            placeholder="MM/DD/YYYY HH:mm"
            type="datetime-local"
            {...register('expiry', {
              required: 'Order expiration date',
              validate: {
                validDate: (expiry) =>
                  dayjs(expiry).isValid() || 'The expiration date must be in the future',
                afterNow: (expiry) =>
                  dayjs(expiry).diff(new Date()) > 0 || 'The expiration date must be in the future',
                before10Years: (expiry) =>
                  dayjs(new Date()).add(10, 'years').isAfter(expiry) ||
                  'The expiration date must be within 10 years',
              },
            })}
          />
        </div>
        {makerAmount >= 0 && takerAmount >= 0 && (
          <div className="form-control mt-4 w-full">
            <span>
              {isSell
                ? `Sell ${makerAmount} bonds for ${takerAmount} USDC.`
                : `Buy ${makerAmount} bonds for ${takerAmount} USDC.`}
            </span>
          </div>
        )}
      </div>
    </>
  )
}
