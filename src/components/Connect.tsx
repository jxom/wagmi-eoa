import { Wallet } from 'ethers'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { EOAConnector } from '../EOAConnector'
import { chains } from '../wagmi'

export function Connect() {
  const { connector, isConnected, isDisconnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const create = () => {
    const wallet = Wallet.createRandom()
    connect({
      connector: new EOAConnector({
        chains,
        options: {
          privateKey: wallet.privateKey
        },
      })
    })
  }

  return (
    <div>
      {isConnected && (
        <button onClick={() => disconnect()}>
          Disconnect from {connector?.name}
        </button>
      )}

      {isDisconnected && (
        <button onClick={() => create()}>Create wallet</button>
      )}
    </div>
  )
}
