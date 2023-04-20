import { ss } from '@/utils/storage'

const LOCAL_NAME = 'LOGIN_STATUS_TOKEN1'

export function getToken() {
  // return ss.get(LOCAL_NAME)
  return window.localStorage.getItem('LOGIN_STATUS_TOKEN') || undefined
}

export function setToken(token: string) {
  return ss.set(LOCAL_NAME, token)
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)
}
