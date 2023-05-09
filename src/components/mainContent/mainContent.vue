<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import useLoading from '../../hooks/loading'
import TagItem from './components/tagItem.vue'

const meats = ['牛肉', '猪肉', '鸡肉']
const vegetable = ['土豆', '胡萝卜', '西红柿']
const currFoods = reactive(new Set<string>())
const menus = ref([])
const active = computed(() => (food: string) => currFoods.has(food))
const toggleAcitve = (food: string) => currFoods.has(food) ? currFoods.delete(food) : currFoods.add(food)
const API_KEY = import.meta.env.APP_KEY

const { startLoading, stopLoading } = useLoading()

async function fetchData() {
  startLoading()
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user', content: `你是一名中国民间大厨，请用${[...currFoods.values()].join('、')}做几道菜，
      返回给我菜名的js数组, 数组长度不小于10`,
      }],
    }),
  })
  const data = await response.json()
  menus.value = JSON.parse(data.choices[0].message.content.match(/\[(.|\n)*?\]/)[0])
  stopLoading()
}
function jumpToDetail(name: string) {
  window.open(encodeURI(`https://baike.baidu.com/item/${name}?fromModule=lemma_search-box`), '_blank')
}
</script>

<template>
  <div class="text-gray-700">
    <div class="text-center">
      <div class="foodstuff">
        <h4 class="mb-8px">
          准备食材
        </h4>
        <section>
          <h2 clas="font-bold">
            肉类
          </h2>
          <TagItem
            v-for="food in meats" :key="food"
            class="meat-item"
            :bg="active(food) ? 'red-500 opacity-90' : 'red-300 opacity-20'"
            :text="active(food) ? 'red-100' : 'red-800 dark:red-200'"
            @click="toggleAcitve(food)"
          >
            {{ food }}
          </TagItem>
        </section>
        <section>
          <h2 clas="font-bold">
            蔬菜
          </h2>
          <TagItem
            v-for="food in vegetable" :key="food"
            class="vegetable-item"
            :bg="active(food) ? 'green-500 opacity-90' : 'green-300 opacity-20'"
            :text="active(food) ? 'green-100' : 'green-800 dark:green-200'"
            @click="toggleAcitve(food)"
          >
            {{ food }}
          </TagItem>
        </section>
      </div>
      <div>
        <div class="wrap">
          <h2 class="text-xl">
            来看看组合出的菜谱吧!
          </h2>
          <button class="btn-submit" @click="fetchData">
            我选好了
          </button>
          <div class="list">
            <TagItem
              v-for="menu in menus" :key="menu"
              class="menu-item"
              bg="blue-300 opacity-20"
              text="blue-800 dark:blue-200"
              @click="jumpToDetail(menu)"
            >
              {{ menu }}
            </TagItem>
          </div>
        </div>
      </div>
    </div>
    <div class="cuisine" />
  </div>
</template>

<style scoped>
.meat-item {
  @apply border-red-3 ml-4px mr-4px;
}
.vegetable-item {
  @apply border-green-3 ml-4px mr-4px;
}
.menu-item {
  @apply border-blue-3 m-4px;
}
section {
  @apply mb-12px;
}
h2 {
  @apply font-bold mb-12px;
}
.btn-submit {
  @apply bg-amber-200 text-amber b b-amber bg-opacity-20
    rounded pl-4px pr-4px hover:shadow-md active:bg-amber-300;
}
.wrap {
  @apply bg-gray-300 bg-opacity-20 p-8px rounded shadow hover:shadow-md;
}
.list {
  @apply min-h-xs mt-16px;
}
</style>
