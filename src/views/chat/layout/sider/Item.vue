<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NInput, NPopconfirm, NScrollbar } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { debounce } from '@/utils/functions/debounce'

const { isMobile } = useBasicLayout()

const appStore = useAppStore()
const chatStore = useChatStore()
const submitLoading = ref(false)

interface Props {
  source: Chat.History
}

defineProps<Props>();


async function handleSelect({ uuid }: Chat.History) {
  if (isActive(uuid))
    return

  if (chatStore.active)
    chatStore.updateHistory(chatStore.active, { isEdit: false })
  await chatStore.setActive(uuid)

  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

function handleEdit({ uuid }: Chat.History, isEdit: boolean, event?: MouseEvent) {
  event?.stopPropagation()
  chatStore.updateHistory(uuid, { isEdit })
}

async function handleDelete(index: number, event?: MouseEvent | TouchEvent) {
  submitLoading.value = true;
  event?.stopPropagation()
  await chatStore.deleteHistory(index)
  submitLoading.value = false;
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

const handleDeleteDebounce = debounce(handleDelete, 600)

function handleEnter({ uuid }: Chat.History, isEdit: boolean, event: KeyboardEvent) {
  event?.stopPropagation()
  if (event.key === 'Enter')
    chatStore.updateHistory(uuid, { isEdit })
}

function isActive(uuid: number) {
  return chatStore.active === uuid
}

</script>

<template>
  <a
    class="relative flex items-center mx-3 my-2 gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
    :class="isActive(source.uuid) && ['border-[#4b9e5f]', 'bg-neutral-100', 'text-[#4b9e5f]', 'dark:bg-[#24272e]', 'dark:border-[#4b9e5f]', 'pr-14']"
    @click="handleSelect(source)"
  >
    <span>
      <SvgIcon icon="ri:message-3-line" />
    </span>
    <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
      <NInput
        v-if="source.isEdit"
        v-model:value="source.title" size="tiny"
        @keypress="handleEnter(source, false, $event)"
      />
      <span v-else>{{ source.title }}</span>
    </div>
    <div v-if="isActive(source.uuid)" class="absolute z-10 flex visible right-1">
      <template v-if="source.isEdit">
        <button class="p-1" @click="handleEdit(source, false, $event)">
          <SvgIcon icon="ri:save-line" />
        </button>
      </template>
      <template v-else>
        <button class="p-1">
          <SvgIcon icon="ri:edit-line" @click="handleEdit(source, true, $event)" />
        </button>
        <NPopconfirm placement="bottom" @positive-click="handleDeleteDebounce(source, $event)">
          <template #trigger>
            <button class="p-1" :loading="submitLoading">
              <SvgIcon icon="eos-icons:loading" v-if="submitLoading" />
              <SvgIcon icon="ri:delete-bin-line" v-else />
            </button>
          </template>
          {{ $t('chat.deleteHistoryConfirm') }}
        </NPopconfirm>
      </template>
    </div>
  </a>
</template>

<style lang="less" scoped>

</style>