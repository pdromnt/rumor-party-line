<template>
  <div>
    <br/>
    <span v-if="rumor.length"><h4>Rumor has it that...</h4> <h2>{{ rumor }}</h2></span>
  </div>
</template>

<script setup lang="ts">
import { usePartyLineStore } from '../stores/partyLine';
import { storeToRefs } from "pinia";

const partyLineStore = usePartyLineStore();
const { rumor } = storeToRefs(partyLineStore);
</script>

<style scoped>
p {
  margin: 5px 0;
}
</style>
