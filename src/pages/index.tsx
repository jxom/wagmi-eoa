import { useAccount } from 'wagmi'

import { Account, Connect, NetworkSwitcher } from '../components'
import { SendTransaction } from '../components/SendTransaction'

function Page() {
  const { isConnected } = useAccount()

  return (
    <>
      <h1>wagmi + Next.js</h1>

      <Connect />

      {isConnected && (
        <>
          <Account />
          <SendTransaction />
          <NetworkSwitcher />
        </>
      )}
    </>
  )
}

export default Page
