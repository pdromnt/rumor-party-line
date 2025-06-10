<template>
  <button class="btn btn-outline btn-info" @click="partyLineStore.fetchPartyLines">Refresh List</button>

  <div class="collapse bg-base-200" v-for="partyLine in partyLines" :key="partyLine.lastEvent">
    <input type="radio" name="my-accordion-1"/>
    <div class="collapse-title text-xl font-medium">{{ partyLine.name }}</div>
    <div class="collapse-content">
      <p>Last Event: {{ partyLine.lastEvent }}</p>
      <p>Last Event: {{ new Date(partyLine.lastActivity).toLocaleString("en-GB") }}</p>
      <br/>
      Clients:
      <ul>
        <li v-for="client in partyLine.clients" :key="client.clientId">
          Client ID: {{ client.clientId }} - IP Address: {{ client.ipAddress }}
        </li>
      </ul>
      <br/>
      <button class="btn btn-outline btn-error" @click="deletePartyLine(partyLine.name)">Delete
        Party Line
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePartyLineStore } from '../stores/partyLine';
import { storeToRefs } from "pinia";

const partyLineStore = usePartyLineStore();
const { partyLines } = storeToRefs(partyLineStore);

onMounted(async () => {
  await partyLineStore.fetchPartyLines();
});

const deletePartyLine = async (partyLine: string) => {
  await partyLineStore.deletePartyLine(partyLine);
};
</script>

<style scoped>
select {
  padding: 8px;
  margin-right: 10px;
}

button {
  padding: 8px;
}
</style>
