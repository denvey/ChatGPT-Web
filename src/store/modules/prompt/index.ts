import { defineStore } from 'pinia'
import type { PromptStore } from './helper'
import { getLocalPromptList, setLocalPromptList } from './helper'

export const usePromptStore = defineStore('prompt-store', {
  state: (): PromptStore => getLocalPromptList(),
  getters: {
    getPromptById(state) {
      return (promptId: number) => {
        if (promptId) {
          return state.promptList.find((item: any) => item.id === promptId);
        }
      }
    },

  },
  actions: {
    updatePromptList(promptList: []) {
      this.$patch({ promptList })
      setLocalPromptList({ promptList })
    },
    getPromptList() {
      return this.$state
    },
  },
})
