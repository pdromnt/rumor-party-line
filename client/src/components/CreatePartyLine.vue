<template>
  <div>
    <input type="text" v-model="partyLineName" placeholder="Enter name" class="input input-bordered w-full max-w-xs"/>
    <button class="btn btn-outline btn-success" @click="createPartyLine">Create Party Line</button>
    <p v-if="status">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePartyLineStore } from '../stores/partyLine';

const partyLineName = ref('');
const status = ref('');
const partyLineStore = usePartyLineStore();

const createPartyLine = async () => {
  if (partyLineName.value.trim()) {
    status.value = ''; // Clear previous status

    partyLineStore.createPartyLine(partyLineName.value).then((data: any) => {
      status.value = data.status;
    });

    partyLineName.value = ''; // Clear the input field

    setTimeout(() => {
      status.value = '';
    }, 5000);
  }
};
</script>

<style scoped>
input {
  padding: 8px;
  margin-right: 10px;
}

button {
  padding: 8px;
}
</style>
