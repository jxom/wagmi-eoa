import { providers, Wallet } from 'ethers'
import { Address, Chain, Connector, ConnectorNotFoundError } from 'wagmi'
import { getProvider } from 'wagmi/actions'


type EOAOptions = {
  privateKey: string
}

export class EOAConnector extends Connector<providers.BaseProvider, EOAOptions> {
  readonly id = 'eoa'
  readonly name = 'Externally Owned Account'
  readonly ready = true

  #wallet?: Wallet

  constructor(config: { chains?: Chain[]; options: EOAOptions }) {
    super(config)
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    if (!this.#wallet) this.#wallet = new Wallet(this.options.privateKey)

    const provider = await this.getProvider({ chainId })
    this.#wallet = this.#wallet.connect(provider)

    const account = this.#wallet.address as Address
    const id = normalizeChainId(provider._network.chainId)
    const unsupported = this.isChainUnsupported(id)

    return { account, chain: { id, unsupported }, provider }
  }

  async disconnect() {
    this.#wallet = undefined
    this.onDisconnect()
  }

  async getAccount() {
    if (!this.#wallet) throw new ConnectorNotFoundError()
    return (await this.#wallet.getAddress()) as Address
  }

  async getChainId() {
    const provider = await this.getProvider()
    return normalizeChainId(provider.network.chainId)
  }

  async getProvider({ chainId }: { chainId?: number } = {}) {
    return getProvider({ chainId })
  }

  async getSigner() {
    return this.#wallet
  }

  async isAuthorized() {
    return Boolean(this.#wallet)
  }

  protected onAccountsChanged = (accounts: Address[]) => {
    if (accounts.length === 0) this.emit('disconnect')
    else this.emit('change', { account: accounts[0] })
  }

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId)
    const unsupported = this.isChainUnsupported(id)
    this.emit('change', { chain: { id, unsupported } })
  }

  protected onDisconnect = () => {
    this.emit('disconnect')
  }
}

export function normalizeChainId(chainId: string | number | bigint) {
  if (typeof chainId === 'string')
    return Number.parseInt(
      chainId,
      chainId.trim().substring(0, 2) === '0x' ? 16 : 10,
    )
  if (typeof chainId === 'bigint') return Number(chainId)
  return chainId
}
