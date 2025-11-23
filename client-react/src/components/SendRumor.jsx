import usePartyLine from "../store/store.js";
import { useState } from "react";
import { getServer } from "../helpers/getServer.js";

const SendRumor = () => {

  const partyLine = usePartyLine((state) => state.partyLine);
  const [rumor, setRumor] = useState('');
  const [rumorHasSpread, setRumorHasSpread] = useState('');

  const setPartyLineName = (partyLineName) => {
    usePartyLine.setState({ partyLine: partyLineName });
  }

  const spreadRumor = async () => {
    if (partyLine.trim() && rumor.trim()) {
      try {
        const response = await fetch(getServer() + '/rumor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ partyLine, rumor: rumor }),
        });

        if (response.ok) {
          console.log('Rumor sent successfully');
          setRumorHasSpread('Rumor has been spread!');

          setTimeout(() => {
            setRumorHasSpread('');
          }, 5000);

          setRumor('');
        } else {
          console.error('Failed to send rumor');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="card bg-base-200 p-4 rounded-box w-full">
      <div className="flex flex-col md:flex-row items-center gap-4 flex-wrap">
        <input type="text" className="input input-bordered flex-1 min-w-0" value={partyLine}
               onChange={e => { setPartyLineName(e.target.value) }}
               placeholder="Enter PartyLine name"/>
        <input type="text" className="input input-bordered flex-1 min-w-0" value={rumor}
               onChange={event => { setRumor(event.target.value) }}
               placeholder="Enter a rumor"/>
        <div className="flex items-center shrink-0">
          <button className="btn btn-outline btn-success" onClick={spreadRumor}>Spread Rumor</button>
        </div>
      </div>
      { rumorHasSpread ? <div className="mt-2">{rumorHasSpread}</div> : null}
    </div>
  )
}

export default SendRumor;