import { getServer } from "../helpers/getServer.js";
import usePartyLine from "../store/store.js";

// Move somewhere else and use React useAudio
// import notification from '/notification.mp3';
// const { play } = useSound(notification);

const connectEventSource = async (currentPartyLine) => {
  if (usePartyLine.getState().eventSource && usePartyLine.getState().partyLine === currentPartyLine) {
    console.log(`Already connected to the PartyLine: ${currentPartyLine}`);
    return;
  }

  if (usePartyLine.getState().eventSource) {
    await disconnectCurrentPartyLine(); // Ensure we disconnect from previous PartyLine, if any
  }

  console.log(`Connecting to PartyLine: ${currentPartyLine}`);
  usePartyLine.setState({eventSource: new EventSource(`${getServer()}/connectPartyLine?partyLine=${encodeURIComponent(currentPartyLine)}`)});

  usePartyLine.getState().eventSource.addEventListener('open', () => {
    console.log('Connected to PartyLine:', currentPartyLine);
  });

  usePartyLine.getState().eventSource.addEventListener('message', (event) => {
    console.log('Rumor received:', event.data);
    if (event.data.toString() !== usePartyLine.getState().rumor) {
      // play();
    }
    usePartyLine.setState({rumor: event.data});
  });

  usePartyLine.getState().eventSource.addEventListener('error', (err) => {
    console.error('EventSource error:', err);
    if (usePartyLine.getState().rumor.includes('PARTY_LINE_DELETED')) {
      disconnectCurrentPartyLine();
      usePartyLine.setState({partyLineDeletedFlag: true});
    } else {
      usePartyLine.getState().eventSource.close();
      setTimeout(() => connectEventSource(currentPartyLine), 5000); // Attempt reconnection after 5 seconds
    }
  });
};

const disconnectCurrentPartyLine = async () => {
  if (usePartyLine.getState().eventSource) {
    console.log(`Disconnecting from PartyLine: ${usePartyLine.getState().partyLine}`);
    usePartyLine.getState().eventSource.close();
    usePartyLine.setState({eventSource: undefined});
    usePartyLine.setState({partyLine: ''});
    usePartyLine.setState({rumor: ''});
    console.log('Disconnected successfully');
  } else {
    console.log('No active connection to disconnect');
  }
};

export { connectEventSource, disconnectCurrentPartyLine };