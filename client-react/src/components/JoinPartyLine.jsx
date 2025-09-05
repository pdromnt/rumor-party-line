import usePartyLine from "../store/store.js";
import { useEffect, useState } from "react";
import { getServer } from "../helpers/getServer.js";
import { connectEventSource, disconnectCurrentPartyLine } from "../services/partyLineSocketService.js";

const JoinPartyLine = () => {

  const partyLine = usePartyLine((state) => state.partyLine);
  const partyLineDeleteFlag = usePartyLine((state) => state.partyLineDeletedFlag);
  const eventSource = usePartyLine((state) => state.eventSource);

  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [partyLineName, setPartyLineName] = useState('');

  useEffect(() => {
    if (!eventSource?.readyState) {
      setStatus('Not connected to any Party Lines...');
    }
  }, [eventSource]);

  useEffect(() => {
    if (!eventSource?.readyState) {
      setError('Party Line has been deleted by the admin!');
    }
  }, [eventSource?.readyState, partyLineDeleteFlag]);

  useEffect(() => {
    setPartyLineName(partyLineName ? partyLineName : partyLine);
  }, [partyLine, partyLineName])

  const joinPartyLine = async () => {
    if (partyLineName.trim()) {
      usePartyLine.setState({ partyLineDeletedFlag: false });
      console.log(`Attempting to join party line: ${partyLineName}`);
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
              setStatus('Connected to Party Line');

              setTimeout(() => {
                setStatus('');
              }, 3000);
            });
          } else {
            console.error('Failed to join party line with error:', response.status + ' ' + response.statusText);
          }
        }))
        .catch(error => {
          console.error('Failed to join party line with error:', error);
          setStatus(error.message || 'An error occurred');
        });
    }
  }

  return (<div className="w-screen text-center">
      <input type="text" onInput={e => setPartyLineName(e.target.value)} value={partyLineName}
             placeholder="Enter Party Line"
             className="input input-bordered w-full max-w-xs"/>
      <button className="btn btn-outline btn-success" onClick={joinPartyLine}>Join Party Line</button>
      <br/>
      {status ? <p><small>{status}</small></p> : null}
      {partyLineDeleteFlag ? <p><small>{error}</small></p> : null}
    </div>)
}

export default JoinPartyLine;