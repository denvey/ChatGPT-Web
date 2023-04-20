import { defineStore } from 'pinia'
import { getToken, setToken } from './helper' // removeToken,
import { store, useUserStore } from '@/store'
import { fetchSession } from '@/api'

interface SessionResponse {
  auth: boolean
  model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
  userInfo?: any
}

export interface AuthState {
  token: string | undefined
  session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    session: null,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.session?.model === 'ChatGPTAPI'
    },
  },

  actions: {
    async getSession() {
      try {
        const { data } = await fetchSession<SessionResponse>()
        this.session = { ...data }
        const userStore = useUserStore();
        if (data.userInfo) {
          userStore.updateUserInfo({
            avatar: data.userInfo.avatar,
            name: data.userInfo.nickname,
            description: data.userInfo.is_money_level > 0 ? 'VIP' : ''
          })
        } else {
          userStore.resetUserInfo();
        }
        return Promise.resolve(data)
      }
      catch (error) {
        // return Promise.reject(error)
      }
    },

    setToken(token: string) {
      this.token = token
      setToken(token)
    },

    removeToken() {
      // this.token = undefined
      // removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
