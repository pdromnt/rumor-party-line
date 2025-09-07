import { useState } from "react";
import { createPartyLine } from "../services/partyLineService.js";

const CreatePartyLine = () => {

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
    <div>
      <input type="text" value={partyLineName} onChange={e => {setPartyLineName(e.target.value)}} placeholder="Enter name"
             className="input input-bordered w-full max-w-xs"/>
      <button className="btn btn-outline btn-success" onClick={createNewPartyLine}>Create Party Line</button>
      {status ? <p>{status}</p> : null}
    </div>
  )
}

export default CreatePartyLine;