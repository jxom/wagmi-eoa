import { chain, configureChains, createClient } from 'wagmi'

import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    ...(process.env.NODE_ENV === 'development' ? [chain.goerli] : []),
  ],
  [
    publicProvider(),
  ],
)

export { chains }

export const client = createClient({
  provider,
  webSocketProvider,
})
