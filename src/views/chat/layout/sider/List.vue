<script setup lang='ts'>
import { computed } from 'vue'
import VirtualList from 'vue3-virtual-scroll-list';
import { useChatStore } from '@/store'
import Item from './Item.vue';


const chatStore = useChatStore()

const dataSources = computed(() => chatStore.history)

const onScrollToBottom = () => {
  chatStore.loadChats();
  console.log('at bottom');
  // chatStore.updateHistory()
  // if (isLoading.value) {
  //   return;
  // }

  // isLoading.value = true;

  // setTimeout(() => {
  //   isLoading.value = false;
  //   items.value = items.value.concat(getPageData(pageSize, items.value.length));
  // }, 500);
};
</script>

<template>
  <VirtualList
    class="list-infinite scroll-touch"
    data-key="uuid"
    :data-sources="dataSources"
    :estimate-size="70"
    :data-component="Item"
    footer-class="loader-wrapper"
    @tobottom="onScrollToBottom"
  >
    <template #={source}>
      <div>{{ source.title }}</div>
    </template>
  </VirtualList>
  <!-- <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>{{ $t('common.noData') }}</span>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) of dataSources" :key="index">
          <a
            class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
            :class="isActive(item.uuid) && ['border-[#4b9e5f]', 'bg-neutral-100', 'text-[#4b9e5f]', 'dark:bg-[#24272e]', 'dark:border-[#4b9e5f]', 'pr-14']"
            @click="handleSelect(item)"
          >
            <span>
              <SvgIcon icon="ri:message-3-line" />
            </span>
            <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
              <NInput
                v-if="item.isEdit"
                v-model:value="item.title" size="tiny"
                @keypress="handleEnter(item, false, $event)"
              />
              <span v-else>{{ item.title }}</span>
            </div>
            <div v-if="isActive(item.uuid)" class="absolute z-10 flex visible right-1">
              <template v-if="item.isEdit">
                <button class="p-1" @click="handleEdit(item, false, $event)">
                  <SvgIcon icon="ri:save-line" />
                </button>
              </template>
              <template v-else>
                <button class="p-1">
                  <SvgIcon icon="ri:edit-line" @click="handleEdit(item, true, $event)" />
                </button>
                <NPopconfirm placement="bottom" @positive-click="handleDeleteDebounce(index, $event)">
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
        </div>
      </template>
    </div>
  </NScrollbar> -->
  
</template>

<style lang="less">
.result {
  margin-bottom: 1em;
}
.list-infinite {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;

  .loader-wrapper {
    padding: 1em;
  }
  .loader {
    font-size: 10px;
    margin: 0px auto;
    text-indent: -9999em;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ffffff;
    background: linear-gradient(
      to right,
      #9b4dca 10%,
      rgba(255, 255, 255, 0) 42%
    );
    position: relative;
    animation: load3 1.4s infinite linear;
    transform: translateZ(0);
  }
  .loader:before {
    width: 50%;
    height: 50%;
    background: #9b4dca;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }
  .loader:after {
    background: #ffffff;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  @-webkit-keyframes load3 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes load3 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>