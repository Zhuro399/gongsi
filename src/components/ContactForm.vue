<script setup lang="ts">
import { ref } from 'vue';
import { getSupabase } from '../lib/supabase';

const name = ref('');
const email = ref('');
const message = ref('');
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const errorMsg = ref('');

async function submitForm() {
  status.value = 'loading';
  const { error } = await getSupabase()
    .from('messages')
    .insert({ name: name.value, email: email.value, message: message.value });

  if (error) {
    status.value = 'error';
    errorMsg.value = error.message;
    return;
  }

  status.value = 'success';
  name.value = '';
  email.value = '';
  message.value = '';
}
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-5">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-300">名字</label>
      <input
        id="name"
        v-model="name"
        required
        type="text"
        class="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500"
        placeholder="你的名字"
      />
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-gray-300">邮箱</label>
      <input
        id="email"
        v-model="email"
        required
        type="email"
        class="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500"
        placeholder="your@email.com"
      />
    </div>
    <div>
      <label for="message" class="block text-sm font-medium text-gray-300">留言</label>
      <textarea
        id="message"
        v-model="message"
        required
        rows="4"
        class="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500"
        placeholder="在此输入你想说的话..."
      ></textarea>
    </div>

    <button
      type="submit"
      :disabled="status === 'loading'"
      class="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {{ status === 'loading' ? '发送中...' : '发送留言' }}
    </button>

    <!-- 成功提示 -->
    <p v-if="status === 'success'" class="rounded-lg bg-green-900/50 px-4 py-3 text-sm text-green-400">
      ✅ 留言已发送，感谢联系！
    </p>
    <!-- 错误提示 -->
    <p v-if="status === 'error'" class="rounded-lg bg-red-900/50 px-4 py-3 text-sm text-red-400">
      ❌ 发送失败：{{ errorMsg }}
    </p>
  </form>
</template>
