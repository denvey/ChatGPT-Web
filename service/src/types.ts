import type { FetchFn } from 'chatgpt'

export interface RequestProps {
  prompt: string
  cid?: number,
  uid?: number,
  options?: ChatContext
  systemMessage: string
  temperature?: number
  top_p?: number
  network?: boolean
  regenerate?: boolean
}

export interface ChatContext {
  conversationId?: string
  parentMessageId?: string
  network?: boolean
}

export interface ChatGPTUnofficialProxyAPIOptions {
  accessToken: string
  apiReverseProxyUrl?: string
  model?: string
  debug?: boolean
  headers?: Record<string, string>
  fetch?: FetchFn
}

export interface ModelConfig {
  apiModel?: ApiModel
  reverseProxy?: string
  timeoutMs?: number
  socksProxy?: string
  httpsProxy?: string
  usage?: string
}

export type ApiModel = 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI' | undefined
