import React from 'react'
import {
  useWallet,
  DEFAULT_NODE_BASEURL,
  DEFAULT_NODE_TOKEN,
  DEFAULT_NODE_PORT
} from '@txnlab/use-wallet'
import algosdk from 'algosdk'

const algodClient = new algosdk.Algodv2(DEFAULT_NODE_TOKEN, DEFAULT_NODE_BASEURL, DEFAULT_NODE_PORT)

export default function Transact() {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()

  const sendTransaction = async (from?: string, to?: string, amount?: number) => {
    if (!from || !to || !amount) {
      throw new Error('Missing transaction params.')
    }

    const suggestedParams = await algodClient.getTransactionParams().do()

    const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from,
      to,
      amount,
      suggestedParams
    })

    const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

    const signedTransactions = await signTransactions([encodedTransaction])

    const waitRoundsToConfirm = 4

    const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)

    console.log('Successfully sent transaction. Transaction ID: ', id)
  }

  if (!activeAddress) {
    return <p>Connect an account first.</p>
  }

  return (
    <div>
      <button
        onClick={() => sendTransaction(activeAddress, activeAddress, 1000)}
        className="button"
      >
        Sign and send transactions
      </button>
    </div>
  )
}