import React, { ReactElement, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'

import { formatUnits } from '@ethersproject/units'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'

import { ReactComponent as ConnectIcon } from '../../assets/svg/connect.svg'
import { ReactComponent as WalletIcon } from '../../assets/svg/wallet.svg'
import BondGraphCard from '../../components/BondGraphCard/BondGraphCard'
import Dev from '../../components/Dev'
import { AuctionTimer } from '../../components/auction/AuctionTimer'
import { ExtraDetailsItem } from '../../components/auction/ExtraDetailsItem'
import { ActiveStatusPill, TableDesign } from '../../components/auction/OrderbookTable'
import BondAction from '../../components/bond/BondAction'
import { ErrorBoundaryWithFallback } from '../../components/common/ErrorAndReload'
import { calculateInterestRate } from '../../components/form/InterestRateInputPanel'
import WarningModal from '../../components/modals/WarningModal'
import TokenLink, { LinkIcon } from '../../components/token/TokenLink'
import TokenLogo from '../../components/token/TokenLogo'
import { useBond } from '../../hooks/useBond'
import { useBondExtraDetails } from '../../hooks/useBondExtraDetails'
import { ConvertButtonOutline, LoadingTwoGrid, SimpleButtonOutline, TwoGridPage } from '../Auction'
import BondManagement from './BondManagement'

import { getPayload } from '@/components/CreditEnhancers/promissory/SignatureRequest'
import PromissoryNoteModal from '@/components/PromissoryNoteModal'
import { Bond } from '@/generated/graphql'
import { useActiveWeb3React } from '@/hooks'

export enum BondActions {
  Redeem,
  Convert,
  Mint,
}

export const BOND_INFORMATION: { [key: string]: { [key: string]: string } } = {
  '0x11f1f978f7944579bb3791b765176de3e68bffc6': {
    auctionId: '20',
    name: 'Shapeshift DAO',
    website: 'https://shapeshift.com/',
    creditAnalysisArbor: '/pdf/ShapeShift Prospectus.pdf',
    creditAnalysisCredora: '/pdf/Shapeshift_Credora_Arbor.pdf',
    prime: 'https://www.prime.xyz/ratings/shapeshift',
    promissoryLink: '',
    contractAddress: '0xc770eefad204b5180df6a14ee197d99d808ee52d',
    description:
      'Shapeshift DAO is a borderless, cross-chain crypto trading platform and portfolio manager enabling user sovereignty.',
    use: `The primary use of the borrowed funds will be used to refinance the existing Rari Fuse loan the DAO currently has.`,
    useLink: 'https://app.rari.capital/fuse/pool/7',
  },
  '0xe34c023c0ea9899a8f8e9381437a604908e8b719': {
    auctionId: '270',
    name: 'Ribbon Finance',
    website: 'https://www.ribbon.finance/',
    creditAnalysis: '/pdf/Ribbon DAO Collateral & Credit Analysis.pdf',
    prime: 'https://www.prime.xyz/ratings/ribbon-finance',
    contractAddress: '0x6123b0049f904d730db3c36a31167d9d4121fa6b',
    description:
      'Ribbon Finance is a suite of DeFi protocols seeking to enhance access to crypto products.',
  },
  '0x0ce1f1cd784bd2341abf21444add0681fe5a526c': {
    auctionId: '20',
    name: 'Shapeshift DAO',
    website: 'https://shapeshift.com/',
    promissoryLink: '',
    creditAnalysisArbor: '/pdf/ShapeShift Prospectus.pdf',
    creditAnalysisCredora: '/pdf/Shapeshift_Credora_Arbor.pdf',
    prime: 'https://www.prime.xyz/ratings/shapeshift',
    contractAddress: '0xc770eefad204b5180df6a14ee197d99d808ee52d',
    description:
      'Shapeshift DAO is a borderless, cross-chain crypto trading platform and portfolio manager enabling user sovereignty.',
    use: `The primary use of the borrowed funds will be used to refinance the existing Rari Fuse loan the DAO currently has.`,
    useLink: 'https://app.rari.capital/fuse/pool/7',
  },
  '0x2e2a42fbe7c7e2ffc031baf7442dbe1f8957770a': {
    // auctionId: '20',
    name: 'Shapeshift DAO',
    website: 'https://shapeshift.com/',
    promissoryMessageHash: '0x3736a8b0abf8fb1f17f9f3f0e88c637a36696a222378c21b9c76d0d33c0cd20a',
    promissoryLink:
      'https://etherscan.io/tx/0x6bdde3d81d3bc3b3824f7eb3038f6c5caa1c9032a3866c23993886d97a4a7c54',
    creditAnalysisArbor: '/pdf/ShapeShift Prospectus.pdf',
    creditAnalysisCredora: '/pdf/Shapeshift_Credora_Arbor.pdf',
    prime: 'https://www.prime.xyz/ratings/shapeshift',
    contractAddress: '0xc770eefad204b5180df6a14ee197d99d808ee52d',
    description:
      'Shapeshift DAO is a borderless, cross-chain crypto trading platform and portfolio manager enabling user sovereignty.',
    use: `The primary use of the borrowed funds will be used to refinance the existing Rari Fuse loan the DAO currently has.`,
    useLink: 'https://app.rari.capital/fuse/pool/7',
  },
}

const BondDetailItem = ({ title, value }: { value: ReactElement; title: string }) => {
  return (
    <span className="flex items-center space-x-1">
      <div className="flex flex-col justify-start">
        <ExtraDetailsItem bordered={true} title={title} titleClass="justify-start" value={value} />
      </div>
    </span>
  )
}

export const BondDetails = ({ id }) => {
  const { data: bond } = useBond(id)
  const { chainId } = useActiveWeb3React()
  const currentBond = BOND_INFORMATION[bond?.id]
  const {
    creditAnalysis,
    creditAnalysisArbor,
    creditAnalysisCredora,
    name,
    prime,
    promissoryLink,
    promissoryMessageHash,
    website,
  } = currentBond || {}
  const promissoryContent = getPayload({ address: bond?.id, chainId })
  const [isPromissoryModalOpen, setIsPromissoryModalOpen] = useState(false)
  return (
    <>
      {creditAnalysisArbor && (
        <div className="col-span-1 border-b border-[#222222]">
          <BondDetailItem
            title="Documents"
            value={
              <LinkIcon color={'#75ed02'} href={creditAnalysisArbor}>
                Arbor Credit Analysis
              </LinkIcon>
            }
          />
        </div>
      )}
      {creditAnalysis && (
        <div className="col-span-1 border-b border-[#222222]">
          <BondDetailItem
            title="Documents"
            value={<LinkIcon href={creditAnalysis}>Credit Analysis</LinkIcon>}
          />
        </div>
      )}
      {creditAnalysisCredora && (
        <div className="col-span-1 border-b border-[#222222] ">
          <BondDetailItem
            title="Documents"
            value={<LinkIcon href={creditAnalysisCredora}>Credora Credit Analysis</LinkIcon>}
          />
        </div>
      )}
      {bond?.owner && (
        <div className="col-span-1 border-b border-[#222222]">
          <BondDetailItem
            title="Etherscan"
            value={
              <LinkIcon href={`https://etherscan.io/address/${bond?.owner}`}>
                Issuer Address
              </LinkIcon>
            }
          />
        </div>
      )}
      {website && (
        <div className="col-span-1 border-b border-[#222222]">
          <BondDetailItem
            title="Website"
            value={<LinkIcon href={website}>{name} Website</LinkIcon>}
          />
        </div>
      )}
      {prime && (
        <div className="col-span-1 border-b border-[#222222]">
          <BondDetailItem title="Website" value={<LinkIcon href={prime}>Prime Rating</LinkIcon>} />
        </div>
      )}
      {promissoryMessageHash && (
        <>
          <PromissoryNoteModal
            close={() => setIsPromissoryModalOpen(false)}
            content={JSON.stringify(promissoryContent, null, 2)}
            isOpen={isPromissoryModalOpen}
            issuer={bond?.owner}
            promissoryLink={promissoryLink}
          />
          <div className="col-span-1 border-b border-[#222222]">
            <div className="cursor-pointer" onClick={() => setIsPromissoryModalOpen(true)}>
              <BondDetailItem
                title="Signature"
                value={<span className="text-[#6CADFB]">Promissory Note</span>}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

const GlobalStyle = createGlobalStyle`
  .siteHeader {
    background: #293327 !important;
  }
`

const RedeemError = () => (
  <div className="card-bordered card">
    <div className="card-body">
      <div className="flex justify-between">
        <h2 className="card-title !text-[#696969]">Redeem</h2>
      </div>
      <div className="space-y-6">
        <div className="text-base text-[#696969]">
          Panel will be active at maturity date or when bond is repaid fully. Whichever comes first.
        </div>
      </div>
    </div>
  </div>
)

const EmptyConnectWallet = () => (
  <div className="space-y-4 py-[50px] text-center text-[#696969]">
    <ConnectIcon className="m-auto" height={49.5} width={51} />
    <div className="text-base">Connect your wallet to view your position</div>
  </div>
)

const EmptyConnected = ({ bondName }) => (
  <div className="space-y-4 py-[50px] text-center text-[#696969]">
    <WalletIcon className="m-auto" height={49.5} width={51} />
    <div className="text-base">You don&apos;t own any {bondName}s</div>
  </div>
)

const ConvertError = () => (
  <div className="card-bordered card">
    <div className="card-body">
      <div className="flex justify-between">
        <h2 className="card-title !text-[#696969]">Convert</h2>
      </div>
      <div className="space-y-6">
        <div className="text-base text-[#696969]">
          The maturity date has passed, therefore bonds can no longer be converted.
        </div>
      </div>
    </div>
  </div>
)

const positionColumns = [
  {
    Header: 'Amount',
    accessor: 'amount',
  },
  {
    Header: 'Cost',
    accessor: 'cost',
    tooltip:
      'This is how much you paid for your bonds. To get this number, we assume you purchased the bonds through the Arbor protocol. If you purchased them off the platform through an OTC deal or AMM, this number may be incorrect.',
  },
  {
    Header: 'Value at maturity',
    accessor: 'maturityValue',
  },
  {
    Header: 'Maturity Date',
    accessor: 'maturityDate',
  },
  {
    Header: 'Fixed YTM',
    tooltip:
      'This yield to maturity is calculated using the closing price of the initial offering.',
    accessor: 'fixedYTM',
  },
]

export const getBondStates = (
  bond: Pick<Bond, 'type' | 'state' | 'maturityDate' | 'maxSupply' | 'amountUnpaid'>,
) => {
  const isConvertBond = bond?.type === 'convert'
  const isDefaulted = bond?.state === 'defaulted'
  const isPartiallyPaid = bond?.maxSupply - bond?.amountUnpaid > 0 && isDefaulted
  const isPaid = bond?.state === 'paidEarly' || bond?.state === 'paid'
  const isActive = bond?.state === 'active'
  const isMatured =
    isDefaulted || (isPaid && bond?.maturityDate < dayjs(new Date()).unix().toString())

  return {
    isMatured,
    isConvertBond,
    isPartiallyPaid,
    isDefaulted,
    isPaid,
    isActive,
  }
}

export const calculatePortfolioRow = (
  bond: Pick<
    Bond,
    'maturityDate' | 'tokenBalances' | 'clearingPrice' | 'decimals' | 'paymentToken' | 'auctions'
  > & { auctions: Pick<Bond['auctions'][0], 'end'>[] },
) => {
  if (bond && Array.isArray(bond.tokenBalances) && bond.tokenBalances.length) {
    const amount = Number(formatUnits(bond?.tokenBalances[0].amount, bond.decimals)) || 0
    const fixedYTM = calculateInterestRate({
      price: bond.clearingPrice,
      maturityDate: bond.maturityDate,
      startDate: bond?.auctions?.[0]?.end,
    })

    return {
      amount: amount.toLocaleString(),
      cost:
        bond?.clearingPrice * amount
          ? `${(bond?.clearingPrice * amount).toLocaleString()} ${bond.paymentToken.symbol}`
          : '-',
      price: bond?.clearingPrice ? bond?.clearingPrice : '-',
      fixedYTM,
      maturityDate: dayjs(bond.maturityDate * 1000)
        .utc()
        .tz()
        .format('ll'),
      maturityValue: amount ? `${amount.toLocaleString()} ${bond.paymentToken.symbol}` : '-',
    }
  }

  return null
}

const BondDetail: React.FC = () => {
  const { account, chainId } = useActiveWeb3React()
  const navigate = useNavigate()
  const { bondId } = useParams()

  const extraDetails = useBondExtraDetails(bondId)
  const { data: bond, loading: isLoading } = useBond(bondId)
  const invalidBond = React.useMemo(() => !bondId || !bond, [bondId, bond])
  const { isConvertBond, isDefaulted, isMatured, isPaid, isPartiallyPaid } = getBondStates(bond)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore idk how to fix this but calculate..() is expecting just auctions[end] not the full Auctions[] thing its complaining about
  const data = calculatePortfolioRow(bond)
  const positionData = data && [data]

  if (isLoading) {
    return (
      <>
        <GlobalStyle />
        <LoadingTwoGrid />
      </>
    )
  }

  if (invalidBond)
    return (
      <>
        <GlobalStyle />
        <WarningModal
          content={`This bond doesn't exist or it hasn't been created yet.`}
          isOpen
          onDismiss={() => navigate('/offerings')}
        />
      </>
    )

  return (
    <>
      <GlobalStyle />
      <ErrorBoundaryWithFallback>
        <div className="flex flex-wrap content-center items-end justify-center py-2 md:justify-between">
          <div className="flex flex-wrap items-center space-x-6">
            <div className="hidden md:flex">
              <TokenLogo
                size="60px"
                square
                token={{
                  address: bond?.id,
                  symbol: bond?.name,
                }}
              />
            </div>
            <div>
              <h1 className="text-4xl capitalize text-white">{bond?.name.toLowerCase()}</h1>
              <p className="text-sm text-blue-100">
                <TokenLink token={bond} withLink />
              </p>
            </div>
          </div>
          <div>{isConvertBond ? <ConvertButtonOutline /> : <SimpleButtonOutline />}</div>
        </div>

        <TwoGridPage
          leftChildren={
            <>
              {bond?.id in BOND_INFORMATION && (
                <div className="card">
                  <div className="card-body">
                    <h2 className="card-title flex flex-row items-center justify-between">
                      <span className="text-3xl">
                        {BOND_INFORMATION[bond?.id].name} information
                      </span>
                    </h2>
                    <span className="mb-3 border-b">{BOND_INFORMATION[bond?.id].description}</span>
                    {BOND_INFORMATION[bond?.id].use && (
                      <>
                        <span className="card-title flex flex-row items-center justify-between">
                          Use of Funds
                        </span>
                        <span>{BOND_INFORMATION[bond?.id].use}</span>
                        <div className="flex flex-row items-center space-x-2 border-b">
                          Read more about it{' '}
                          <a
                            className="text-[#6CADFB]"
                            href={BOND_INFORMATION[bond?.id].useLink}
                            rel="noreferrer"
                            target="_blank"
                          >
                            &nbsp;here.
                          </a>
                        </div>
                      </>
                    )}
                    <div
                      className={`grid grid-cols-1 gap-x-12 gap-y-8 pt-8 ${
                        isConvertBond ? 'md:grid-cols-3' : 'md:grid-cols-4'
                      }`}
                    >
                      <BondDetails id={bond?.id} />
                    </div>
                  </div>
                </div>
              )}
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title flex flex-row items-center justify-between">
                    <span>Bond information</span>
                    {!isMatured ? (
                      <ActiveStatusPill />
                    ) : (
                      <ActiveStatusPill disabled title="Matured" />
                    )}
                  </h2>

                  <AuctionTimer
                    color="purple"
                    days
                    endDate={bond?.maturityDate}
                    endText="Maturity date"
                    endTip="Date each bond can be redeemed for $1 assuming no default. Convertible bonds cannot be converted after this date."
                    rightOfCountdown={
                      !(bond?.id in BOND_INFORMATION) && (
                        <a
                          href={`https://etherscan.io/address/${bond?.owner || ''}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <button className="btn-primary btn-sm btn space-x-2 rounded-md bg-[#293327] !text-xxs font-normal">
                            <span>Issuer Information</span>
                            <span>
                              <DoubleArrowRightIcon />
                            </span>
                          </button>
                        </a>
                      )
                    }
                    startDate={bond?.createdAt}
                    startText="Issuance date"
                    startTip="Time the bonds were minted."
                    text="Time until maturity"
                  />

                  <div
                    className={`grid grid-cols-1 gap-x-12 gap-y-8 pt-12 ${
                      isConvertBond ? 'md:grid-cols-3' : 'md:grid-cols-4'
                    }`}
                  >
                    {extraDetails.map((item, index) => (
                      <ExtraDetailsItem key={index} {...item} />
                    ))}
                  </div>
                </div>
              </div>

              <BondGraphCard bond={bond as Bond} />

              <div className="card">
                <div className="card-body">
                  <h2 className="card-title">Your position</h2>

                  {/* TODO: extract this component from everywhere, its a nice empty state */}
                  {!account && <EmptyConnectWallet />}
                  {account && !positionData?.length ? (
                    <EmptyConnected bondName={bond?.name} />
                  ) : null}
                  {account && positionData?.length ? (
                    <TableDesign
                      className="min-h-full"
                      columns={positionColumns}
                      data={positionData}
                      hidePagination
                      showConnect
                    />
                  ) : null}
                </div>
              </div>
            </>
          }
          rightChildren={
            <>
              {/* prettier-ignore */}
              <Dev>{JSON.stringify({ isConvertBond, beforeMaturity: !isMatured, afterMaturity: isMatured, isRepaid: isPaid, isDefaulted, isPartiallyPaid, isWalletConnected: !!account }, null, 2)}</Dev>
              {isConvertBond && isMatured && <ConvertError />}
              {isConvertBond && !isMatured && <BondAction componentType={BondActions.Convert} />}
              {(isPartiallyPaid || isPaid || isDefaulted || isMatured) && (
                <BondAction componentType={BondActions.Redeem} />
              )}
              {!isMatured && !isPaid && !isDefaulted && <RedeemError />}
              <BondManagement />
            </>
          }
        />
      </ErrorBoundaryWithFallback>
    </>
  )
}

export default React.memo(BondDetail)
