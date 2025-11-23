import { useState } from "react";
import { createPartyLine } from "../services/partyLineService.js";

const Create = () => {

  const [partyLineName, setPartyLineName] = useState('');
  const [status, setStatus] = useState('');

  const createNewPartyLine = async () => {
    if(partyLineName.trim()) {
      setStatus(''); // Clear previous status

      createPartyLine(partyLineName).then((response) => {
        setStatus(response.status)
      })

      setPartyLineName(''); // Clear input

      setTimeout(() => {
        setStatus('');
      }, 5000);
    }
  }

  return (
    <div className="card bg-base-200 p-4 rounded-box w-full">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <input type="text" value={partyLineName} onChange={e => {setPartyLineName(e.target.value)}} placeholder="Enter a name"
               className="input input-bordered w-full max-w"/>
        <button className="btn btn-outline btn-success" onClick={createNewPartyLine}>Create PartyLine</button>
      </div>
      {status ? <p className="text-center mt-2">{status}</p> : null}
    </div>
  )
}

export default Create;