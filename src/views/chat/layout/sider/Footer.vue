<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NDrawer, NDrawerContent } from 'naive-ui'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'

import { useUserStore } from '@/store'

// const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))
const show = ref(false)
const loading = ref(false)

const userStore = useUserStore()
function handleGo(num: number) {
  window.history.go(num)
}

const userInfo: any = computed(() => userStore.userInfo)

if (!userInfo.name) {
  show.value = true
}

function openDrawer() {
  show.value = true
  loading.value = true;

  setTimeout(() => {
    const $userInfo = document.getElementById("user-info");
    if ($userInfo) {
      $userInfo.onload = () => {
        loading.value = false;
      }
    }
  }, 300)
}

</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t dark:border-neutral-800">
    <div class="flex-1 flex-shrink-0 overflow-hidden" @click="openDrawer">
      <UserAvatar />
    </div>

    <HoverButton @click="openDrawer">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
    </HoverButton>

    <NDrawer v-model:show="show" :width="327" placement="left">
      <NDrawerContent title="个人中心" closable :body-content-style="{ padding: 0 }">
          <iframe id="user-info" class="iframe-wrap" src="https://xjh.qqshsh.com/pages/user/index"></iframe>
          <div class="operation-wrap">
            <span @click="() => handleGo(-1)">
              <SvgIcon icon="material-symbols:arrow-back" />
            </span>
            <span @click="() => handleGo(1)">
              <SvgIcon icon="material-symbols:arrow-forward" />
            </span>
          </div>
      </NDrawerContent>
    </NDrawer>
    <!-- <Setting v-if="show" v-model:visible="show" /> -->
  </footer>
</template>

<style lang="less">
.iframe-wrap {
  width: 100%;
  height: 100%;
}
.operation-wrap {
  position: fixed;
  background: #fff;
  width: 327px;
  height: 40px;
  left: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 24px;
}
</style>
