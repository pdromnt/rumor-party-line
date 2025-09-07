import { Fragment, useEffect } from "react";
import { fetchPartyLines, deletePartyLine } from "../services/partyLineService.js";
import usePartyLine from "../store/store.js";

const DeletePartyLine = () => {
  const partyLines = usePartyLine((state) => state.partyLines);

  useEffect(() => {
    (async () => {
      await fetchPartyLines();
    })();
  }, [])

  return (<div>
    <button className="btn btn-outline btn-info" onClick={() => {
      fetchPartyLines()
    }}>Refresh List
    </button>

    {partyLines.map((partyLine) => (
      <div className="collapse bg-base-200" key={partyLine.lastEvent}>
        <input type="radio" name="my-accordion-1"/>
        <div className="collapse-title text-xl font-medium">{partyLine.name}</div>
        <div className="collapse-content">
          <p>Last Event: {partyLine.lastEvent}</p>
          <p>Last Event: {new Date(partyLine.lastActivity).toLocaleString("en-GB")}</p>
          <br/>
          Clients:
          <ul>
            {partyLine.clients.map((client) => (
              <li key={client.clientId}>
                Client ID: {client.clientId} - IP Address: {client.ipAddress}
              </li>
            ))}
          </ul>
          <br/>
          <button className="btn btn-outline btn-error" onClick={() => {
            deletePartyLine(partyLine.name)
          }}>
            Delete Party Line
          </button>
        </div>
      </div>
    ))}
  </div>)
}

export default DeletePartyLine;