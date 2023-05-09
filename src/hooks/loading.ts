import { createApp, onMounted, ref } from 'vue'

import Loading from '../components/loading/loading.vue'

export default function useLoading() {
  const loading = ref(false)
  let $loading
  onMounted(() => {
    $loading = createApp(Loading, { loading }).mount(document.createElement('div'))
  })

  const startLoading = () => {
    loading.value = true
    document.body.appendChild($loading.$el)
  }
  const stopLoading = () => loading.value = false

  return {
    loading,
    startLoading,
    stopLoading,
  }
}
