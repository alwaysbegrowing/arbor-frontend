import { splitSignature, verifyTypedData } from 'ethers/lib/utils'
import {} from '@rainbow-me/rainbowkit'
export const ARBOR_PROMISSORY_NOTE_DOMAIN = ({ chainId }: { chainId: number }) => ({
  chainId,
  name: 'Arbor Finance',
  version: '1.0.0',
})

const ARBOR_PROMISSORY_NOTE_STRUCT = [
  { type: 'address', name: 'bond' },
  { type: 'string', name: 'content' },
]

export const arborTypes = {
  PromissoryNote: ARBOR_PROMISSORY_NOTE_STRUCT,
}

export const signPromissoryNote = async ({ bondToSign, chainId, signer }) => {
  const value = {
    bond: bondToSign?.id,
    content: 'This signature represents a promise to pay the bond unconditionally.',
  }
  const signedTypedData = await signer._signTypedData(
    ARBOR_PROMISSORY_NOTE_DOMAIN({ chainId }),
    arborTypes,
    value,
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
    verifyTypedData(ARBOR_PROMISSORY_NOTE_DOMAIN({ chainId }), arborTypes, value, signature),
  )
}
