import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { t } from '@/locales'
import { useChatStore } from '@/store'

export function useUsingNetwork() {
  const ms = useMessage()
  const chatStore = useChatStore()
  const usingNetwork = computed<boolean>(() => chatStore.usingNetwork)

  function toggleUsingNetwork() {
    chatStore.setUsingNetwork(!usingNetwork.value)
    if (usingNetwork.value)
      ms.success(t('chat.turnOnNetwork'))
    else
      ms.warning(t('chat.turnOffNetwork'))
  }

  return {
    usingNetwork,
    toggleUsingNetwork,
  }
}
