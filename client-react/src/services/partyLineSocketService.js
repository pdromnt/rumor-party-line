import { getServer } from "../helpers/getServer.js";

// These should be in a store
let partyLines = [];
let partyLine = '';
let rumor = '';
let eventSource;
let partyLineDeletedFlag = false;

// Move somewhere else and use react useAudio
// import notification from '/notification.mp3';
// const { play } = useSound(notification);

const connectEventSource = async (currentPartyLine) => {
  if (eventSource && partyLine === currentPartyLine) {
    console.log(`Already connected to the party line: ${currentPartyLine}`);
    return;
  }

  if (eventSource) {
    await disconnectCurrentPartyLine(); // Ensure we disconnect from previous party line, if any
  }

  console.log(`Connecting to party line: ${currentPartyLine}`);
  eventSource = new EventSource(`${getServer()}/connectPartyLine?partyLine=${encodeURIComponent(currentPartyLine)}`);

  eventSource.addEventListener('open', () => {
    console.log('Connected to party line:', currentPartyLine);
  });

  eventSource.addEventListener('message', (event) => {
    console.log('Rumor received:', event.data);
    if (event.data.toString() !== rumor) {
      play();
    }
    rumor = event.data;
  });

  eventSource.addEventListener('error', (err) => {
    console.error('EventSource error:', err);
    if (rumor.includes('PARTY_LINE_DELETED')) {
      disconnectCurrentPartyLine();
      partyLineDeletedFlag = true;
    } else {
      eventSource.close();
      setTimeout(() => connectEventSource(currentPartyLine), 5000); // Attempt reconnection after 5 seconds
    }
  });
};

const disconnectCurrentPartyLine = async () => {
  if (eventSource) {
    console.log(`Disconnecting from party line: ${partyLine}`);
    eventSource.close();
    eventSource = null;
    partyLine = '';
    rumor = '';
    console.log('Disconnected successfully');
  } else {
    console.log('No active connection to disconnect');
  }
};

export { connectEventSource, disconnectCurrentPartyLine };