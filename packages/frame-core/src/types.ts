import type { Address, Provider, RpcRequest, RpcResponse, RpcSchema } from 'ox'
import type { AddFrame, SignIn, Swap, ViewProfile, ViewToken } from './actions'
import type { FrameContext } from './context'
import type {
  EventFrameAdded,
  EventFrameRemoved,
  EventNotificationsDisabled,
  EventNotificationsEnabled,
} from './schemas'

export type SetPrimaryButtonOptions = {
  text: string
  loading?: boolean
  disabled?: boolean
  hidden?: boolean
}

export type SetPrimaryButton = (options: SetPrimaryButtonOptions) => void

export type EthProviderRequest = Provider.RequestFn<RpcSchema.Default>

export type ReadyOptions = {
  /**
   * Disable native gestures. Use this option if your frame uses gestures
   * that conflict with native gestures.
   *
   * @defaultValue false
   */
  disableNativeGestures: boolean
}

export const DEFAULT_READY_OPTIONS: ReadyOptions = {
  disableNativeGestures: false,
}

export type SignInOptions = {
  /**
   * A random string used to prevent replay attacks.
   */
  nonce: string

  /**
   * Start time at which the signature becomes valid.
   * ISO 8601 datetime.
   */
  notBefore?: string

  /**
   * Expiration time at which the signature is no longer valid.
   * ISO 8601 datetime.
   */
  expirationTime?: string
}

export type WireFrameHost = {
  context: FrameContext
  close: () => void
  ready: (options?: Partial<ReadyOptions>) => void
  openUrl: (url: string) => void
  signIn: SignIn.WireSignIn
  setPrimaryButton: SetPrimaryButton
  ethProviderRequest: EthProviderRequest
  ethProviderRequestV2: RpcTransport
  eip6963RequestProvider: () => void
  addFrame: AddFrame.WireAddFrame
  viewProfile: ViewProfile.ViewProfile
  viewToken: ViewToken.ViewToken
  swap: Swap.Swap
}

export type FrameHost = {
  context: FrameContext
  close: () => void
  ready: (options?: Partial<ReadyOptions>) => void
  openUrl: (url: string) => void
  signIn: SignIn.SignIn
  setPrimaryButton: SetPrimaryButton
  ethProviderRequest: EthProviderRequest
  ethProviderRequestV2: RpcTransport
  /**
   * Receive forwarded eip6963:requestProvider events from the frame document.
   * Hosts must emit an EventEip6963AnnounceProvider in response.
   */
  eip6963RequestProvider: () => void
  addFrame: AddFrame.AddFrame
  viewProfile: ViewProfile.ViewProfile
  viewToken: ViewToken.ViewToken
  swap: Swap.Swap
}

export type FrameEthProviderEventData = {
  type: 'frame_eth_provider_event'
} & EthProviderWireEvent

export type RpcTransport = (
  request: RpcRequest.RpcRequest,
) => Promise<RpcResponse.RpcResponse>

export type ProviderRpcError = {
  code: number
  details?: string
  message?: string
}

export type EthProviderWireEvent =
  | {
      event: 'accountsChanged'
      params: [readonly Address.Address[]]
    }
  | {
      event: 'chainChanged'
      params: [string]
    }
  | {
      event: 'connect'
      params: [Provider.ConnectInfo]
    }
  | {
      event: 'disconnect'
      params: [ProviderRpcError]
    }
  | {
      event: 'message'
      params: [Provider.Message]
    }

export type EmitEthProvider = <event extends EthProviderWireEvent['event']>(
  event: event,
  params: Extract<EthProviderWireEvent, { event: event }>['params'],
) => void

export type EventFrameAddRejected = {
  event: 'frame_add_rejected'
  reason: AddFrame.AddFrameRejectedReason
}

export type EventPrimaryButtonClicked = {
  event: 'primary_button_clicked'
}

/**
 * Metadata of the EIP-1193 Provider.
 */
export interface EIP6963ProviderInfo {
  icon: `data:image/${string}` // RFC-2397
  name: string
  rdns: string
  uuid: string
}

export type EventEip6963AnnounceProvider = {
  event: 'eip6963:announceProvider'
  info: EIP6963ProviderInfo
}

export type FrameClientEvent =
  | EventFrameAdded
  | EventFrameAddRejected
  | EventFrameRemoved
  | EventNotificationsEnabled
  | EventNotificationsDisabled
  | EventPrimaryButtonClicked
  | EventEip6963AnnounceProvider
