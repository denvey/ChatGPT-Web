import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post, axios } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string,
		cid?: number,
    uid?: number,
		network?: boolean,
    regenerate?: boolean,
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
    cid: params.cid,
    uid: params.uid,
    network: params.network,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export function findMessage (data: any) {
  return axios({
    url: `/proxy/message`,
    params: data
  })
}

export function updateMessage (data: any) {
  return axios({
    url: `/proxy/message:update?filterByTk=${data.id}`,
    method: 'POST',
    data
  })
}

export function findChats(params: { page: number, pageSize?: number}) {
	return axios(`/proxy/chats:list?sort=-updatedAt`, {
    params
  });
}

export function addChat(data: any) {
  return axios({
    url: `/proxy/chats:create`,
    method: 'POST',
    data
  })
}

// https://admin.qqshsh.com/api/chats:destroy?filterByTk=109

export function delChat(id: number) {
  return axios({
    url: `/proxy/chats:destroy`,
    method: 'POST',
    params: {
      filterByTk: id
    }
  })
}