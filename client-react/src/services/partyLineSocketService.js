import { getServer } from "../helpers/getServer.js";
import usePartyLine from "../store/store.js";

// Move somewhere else and use React useAudio
// import notification from '/notification.mp3';
// const { play } = useSound(notification);

const connectEventSource = async (currentPartyLine) => {
  if (usePartyLine.getState().eventSource && usePartyLine.getState().partyLine === currentPartyLine) {
    console.log(`Already connected to the party line: ${currentPartyLine}`);
    return;
  }

  if (usePartyLine.getState().eventSource) {
    await disconnectCurrentPartyLine(); // Ensure we disconnect from previous party line, if any
  }

  console.log(`Connecting to party line: ${currentPartyLine}`);
  usePartyLine.getState().eventSource = new EventSource(`${getServer()}/connectPartyLine?partyLine=${encodeURIComponent(currentPartyLine)}`);

  usePartyLine.getState().eventSource.addEventListener('open', () => {
    console.log('Connected to party line:', currentPartyLine);
  });

  usePartyLine.getState().eventSource.addEventListener('message', (event) => {
    console.log('Rumor received:', event.data);
    if (event.data.toString() !== usePartyLine.getState().rumor) {
      play();
    }
    usePartyLine.getState().rumor = event.data;
  });

  usePartyLine.getState().eventSource.addEventListener('error', (err) => {
    console.error('EventSource error:', err);
    if (usePartyLine.getState().rumor.includes('PARTY_LINE_DELETED')) {
      disconnectCurrentPartyLine();
      usePartyLine.getState().partyLineDeletedFlag = true;
    } else {
      usePartyLine.getState().eventSource.close();
      setTimeout(() => connectEventSource(currentPartyLine), 5000); // Attempt reconnection after 5 seconds
    }
  });
};

const disconnectCurrentPartyLine = async () => {
  if (usePartyLine.getState().eventSource) {
    console.log(`Disconnecting from party line: ${usePartyLine.getState().partyLine}`);
    usePartyLine.getState().eventSource.close();
    usePartyLine.getState().eventSource = null;
    usePartyLine.getState().partyLine = '';
    usePartyLine.getState().rumor = '';
    console.log('Disconnected successfully');
  } else {
    console.log('No active connection to disconnect');
  }
};

export { connectEventSource, disconnectCurrentPartyLine };