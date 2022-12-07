import { splitSignature, verifyTypedData } from 'ethers/lib/utils'
import {} from '@rainbow-me/rainbowkit'
export const ARBOR_PROMISSORY_NOTE_DOMAIN = ({ chainId }: { chainId: number }) => ({
  chainId,
  name: 'Arbor Finance',
  version: '1.0.0',
})

export const ARBOR_PROMISSORY_NOTE_TYPES = {
  PromissoryNote: [
    { type: 'address', name: 'bond' },
    { type: 'string', name: 'content' },
  ],
}

export const ARBOR_PROMISSORY_NOTE_VALUE = (bondAddress: string) => ({
  bond: bondAddress,
  content:
    'This signature represents a promise to unconditionally pay the bond by the maturity date.',
})

export const signPromissoryNote = async ({ bondToSign, chainId, signer }) => {
  if (!bondToSign?.id) return

  const signedTypedData = await signer._signTypedData(
    ARBOR_PROMISSORY_NOTE_DOMAIN({ chainId }),
    ARBOR_PROMISSORY_NOTE_TYPES,
    ARBOR_PROMISSORY_NOTE_VALUE(bondToSign.id),
  )

  // Gnosis Safe
  if (signedTypedData == '0x') return

  const { r, s, v } = splitSignature(signedTypedData)
  const signature = {
    v,
    r,
    s,
    signatureType: 2,
  }
  console.log(signature)
  console.log(
    verifyTypedData(
      ARBOR_PROMISSORY_NOTE_DOMAIN({ chainId }),
      ARBOR_PROMISSORY_NOTE_TYPES,
      ARBOR_PROMISSORY_NOTE_VALUE(bondToSign.id),
      signature,
    ),
  )
}
