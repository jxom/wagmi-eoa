import { parseEther } from 'ethers/lib/utils.js'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

export const SendTransaction = () => {
  const { data, isLoading, isSuccess, isError, error, sendTransaction } =
    useSendTransaction({
      mode: 'recklesslyUnprepared', request: {
        to: 'jxom.eth',
        value: parseEther('1'),
      }
    })

  return (
    <div>
      <button
        disabled={isLoading}
        onClick={() => sendTransaction()}
      >
        Send Transaction
      </button>
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      {isError && <div>Error sending transaction: {error?.message}</div>}
    </div>
  )
}
