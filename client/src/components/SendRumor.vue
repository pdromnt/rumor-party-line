<template>
  <div>
    <input type="text" class="input input-bordered w-full max-w-xs" v-model="partyLineModel" placeholder="Enter name"/>
    <input type="text" class="input input-bordered w-full max-w-xs" v-model="rumor" placeholder="Enter rumor"/>
    <button class="btn btn-outline btn-success" @click="sendRumor">Send Rumor</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePartyLineStore } from "@/stores/partyLine.ts";
import { storeToRefs } from "pinia";
import { useGetServer } from "@/composables/useGetServer.ts";

const partyLineStore = usePartyLineStore();
const { partyLine } = storeToRefs(partyLineStore);

const rumor = ref('');
const partyLineName = ref('');

const partyLineModel = computed({
  get: () => partyLineName.value ? partyLineName.value : partyLine.value,
  set: (value: string) => {
    partyLineName.value = value;
  }
});

const sendRumor = async () => {
  if (partyLineModel.value.trim() && rumor.value.trim()) {
    try {
      const response = await fetch(useGetServer() + '/rumor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partyLine: partyLineModel.value, rumor: rumor.value }),
      });

      if (response.ok) {
        console.log('Rumor sent successfully');
        rumor.value = '';
      } else {
        console.error('Failed to send rumor');
      }
    } catch (error) {
      console.error('Error:', error);
    }
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
