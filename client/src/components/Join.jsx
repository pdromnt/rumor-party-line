import usePartyLine from "../store/store.js";
import { useEffect, useState } from "react";
import { getServer } from "../helpers/getServer.js";
import { connectEventSource, disconnectCurrentPartyLine } from "../services/partyLineSocketService.js";

const Join = () => {
  const partyLine = usePartyLine((state) => state.partyLine);
  const partyLineDeleteFlag = usePartyLine((state) => state.partyLineDeletedFlag);
  const eventSource = usePartyLine((state) => state.eventSource);

  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [partyLineName, setPartyLineName] = useState('');

  useEffect(() => {
    if (!eventSource?.readyState) {
      setStatus('Not connected to any PartyLines...');
    }
  }, [eventSource]);

  useEffect(() => {
    if (!eventSource?.readyState) {
      setError('PartyLine has been deleted by the admin!');
    }
  }, [eventSource?.readyState]);

  useEffect(() => {
    setPartyLineName(partyLineName ? partyLineName : partyLine);
  }, [partyLine])

  const joinPartyLine = async () => {
    if (partyLineName.trim()) {
      usePartyLine.setState({ partyLineDeletedFlag: false });
      console.log(`Attempting to join PartyLine: ${partyLineName}`);
      setStatus('Connecting...');

      // Ensure we disconnect from the current line if connected
      if (partyLine) {
        await disconnectCurrentPartyLine();
      }

      fetch(`${getServer()}/joinPartyLine?partyLine=${encodeURIComponent(partyLineName)}`, {
        method: 'GET', headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json().then(result => {
          setStatus(result.status + ' (' + response.status + ' ' + response.statusText + ')');
          if (response.ok) {
            usePartyLine.setState({ partyLine: partyLineName });
            connectEventSource(partyLineName).then(() => {
              setStatus('Connected to PartyLine');

              setTimeout(() => {
                setStatus('');
              }, 3000);
            });
          } else {
            console.error('Failed to join PartyLine with error:', response.status + ' ' + response.statusText);
          }
        }))
        .catch(error => {
          console.error('Failed to join PartyLine with error:', error);
          setStatus(error.message || 'An error occurred');
        });
    }
  }

  return (
    <div className="card bg-base-200 p-4 rounded-box w-full">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <input type="text" onInput={e => setPartyLineName(e.target.value)} value={partyLineName}
          placeholder="Enter PartyLine"
          className="input input-bordered flex-1 min-w-0 max-w-md" />
        <button className="btn btn-outline btn-success shrink-0" onClick={joinPartyLine}>Join PartyLine</button>
      </div>
      {(status || partyLineDeleteFlag) && (
        <div className="mt-2 text-center">
          {status ? <p><small>{status}</small></p> : null}
          {partyLineDeleteFlag ? <p><small>{error}</small></p> : null}
        </div>
      )}
    </div>
  )
}

export default Join;