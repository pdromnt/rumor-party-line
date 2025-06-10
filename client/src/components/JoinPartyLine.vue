<template>
  <div class="w-screen text-center">
    <input type="text" v-model="partyLineModel" placeholder="Enter Party Line"
           class="input input-bordered w-full max-w-xs"/>
    <button class="btn btn-outline btn-success" @click="joinPartyLine">Join Party Line</button>
    <br/>
    <p v-if="status"><small>{{ status }}</small></p>
    <p v-if="partyLineDeletedFlag"><small>{{ error }}</small></p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { usePartyLineStore } from '../stores/partyLine';
import { storeToRefs } from "pinia";
import { useGetServer } from "@/composables/useGetServer.ts";

const partyLineName = ref('');
const status = ref('');
const error = ref('');
const partyLineStore = usePartyLineStore();

const { partyLine, partyLineDeletedFlag, eventSource } = storeToRefs(partyLineStore);

watch(eventSource, () => {
  if (!eventSource.value?.readyState) {
    status.value = 'Not connected to any Party Lines...';
  }
}, { immediate: true });

watch(partyLineDeletedFlag, () => {
  error.value = 'Party Line has been deleted by the admin';
}, { immediate: true });

const partyLineModel = computed({
  get: () => partyLineName.value ? partyLineName.value : partyLine.value,
  set: (value: string) => {
    partyLineName.value = value;
  }
});

const joinPartyLine = async () => {
  if (partyLineName.value.trim()) {
    partyLineDeletedFlag.value = false;
    console.log(`Attempting to join party line: ${partyLineName.value}`);
    status.value = 'Connecting...';

    // Ensure we disconnect from the current line if connected
    if (partyLine) {
      await partyLineStore.disconnectCurrentPartyLine();
    }

    fetch(`${useGetServer()}/joinPartyLine?partyLine=${encodeURIComponent(partyLineName.value)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then(response => response.json().then(result => {
          status.value = result.status + ' (' + response.status + ' ' + response.statusText + ')';
          if (response.ok) {
            partyLine.value = partyLineName.value;
            partyLineStore.connectEventSource(partyLineName.value).then(() => {
              status.value = 'Connected to Party Line';

              setTimeout(() => {
                status.value = '';
              }, 3000);
            });
          } else {
            console.error('Failed to join party line with error:', response.status + ' ' + response.statusText);
          }
        }))
        .catch(error => {
          console.error('Failed to join party line with error:', error);
          status.value = error.message || 'An error occurred';
        });
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
