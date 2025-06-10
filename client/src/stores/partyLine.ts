import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useGetServer } from "@/composables/useGetServer.ts";
import { useSound } from '@vueuse/sound';
import notification from '/notification.mp3';
import type { PartyLine } from "@/types/partyLine.ts";

export const usePartyLineStore = defineStore('partyLine', () => {

  const partyLines = ref<PartyLine[]>([]);
  const partyLine = ref('');
  const rumor = ref('');
  const eventSource = ref<EventSource | null>(null);
  const partyLineDeletedFlag = ref(false);
  const { play } = useSound(notification);

  const connectEventSource = async (currentPartyLine: string) => {
    if (eventSource.value && partyLine.value === currentPartyLine) {
      console.log(`Already connected to the party line: ${currentPartyLine}`);
      return;
    }

    if (eventSource.value) {
      await disconnectCurrentPartyLine(); // Ensure we disconnect from previous party line, if any
    }

    console.log(`Connecting to party line: ${currentPartyLine}`);
    eventSource.value = new EventSource(`${useGetServer()}/connectPartyLine?partyLine=${encodeURIComponent(currentPartyLine)}`);

    eventSource.value.addEventListener('open', () => {
      console.log('Connected to party line:', currentPartyLine);
    });

    eventSource.value.addEventListener('message', (event) => {
      console.log('Rumor received:', event.data);
      if (event.data.toString() !== rumor.value) {
        play();
      }
      rumor.value = event.data;
    });

    eventSource.value.addEventListener('error', (err) => {
      console.error('EventSource error:', err);
      if (rumor.value.includes('PARTY_LINE_DELETED')) {
        disconnectCurrentPartyLine();
        partyLineDeletedFlag.value = true;
      } else {
        eventSource.value!.close();
        setTimeout(() => connectEventSource(currentPartyLine), 5000); // Attempt reconnection after 5 seconds
      }
    });
  };

  const disconnectCurrentPartyLine = async () => {
    if (eventSource.value) {
      console.log(`Disconnecting from party line: ${partyLine.value}`);
      eventSource.value.close();
      eventSource.value = null;
      partyLine.value = '';
      rumor.value = '';
      console.log('Disconnected successfully');
    } else {
      console.log('No active connection to disconnect');
    }
  };

  const fetchPartyLines = async () => {
    fetch(useGetServer() + '/partyLines')
      .then(response => response.json())
      .then(data => {
        partyLines.value = data;
      })
      .catch(error => {
        console.error('Error fetching party lines:', error);
      });
  };

  const createPartyLine = async (partyLine: string) => {
    return fetch(useGetServer() + '/createPartyLine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ partyLine }),
    })
      .then(async response => {
        if (response.ok) {
          await fetchPartyLines();
        } else {
          console.error('Failed to create party line');
        }

        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error creating party line:', error);
        throw error;
      });
  };

  const deletePartyLine = async (partyLine: string) => {
    fetch(useGetServer() + '/deletePartyLine', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ partyLine }),
    })
      .then(response => {
        if (response.ok) {
          console.log(`Deleted party line: ${partyLine}`);
          return fetchPartyLines(); // Refresh the party lines after deletion
        } else {
          console.error('Failed to delete party line');
        }
      })
      .catch(error => {
        console.error('Error deleting party line:', error);
      });
  };

  return {
    rumor,
    partyLine,
    partyLines,
    eventSource,
    partyLineDeletedFlag,
    connectEventSource,
    disconnectCurrentPartyLine,
    fetchPartyLines,
    createPartyLine,
    deletePartyLine,
  };
});
