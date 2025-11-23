import { Fragment, useEffect } from "react";
import { fetchPartyLines, deletePartyLine } from "../services/partyLineService.js";
import usePartyLine from "../store/store.js";

const Status = () => {
  const partyLines = usePartyLine((state) => state.partyLines);

  useEffect(() => {
    (async () => {
      await fetchPartyLines();
    })();
  }, [])

  return (
    <div className="card bg-base-200 p-4 rounded-box w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">PartyLines</h3>
        <button className="btn btn-outline btn-info" onClick={() => { fetchPartyLines() }}>Refresh List</button>
      </div>

      {partyLines && partyLines.length > 0 ? (
        <div className="flex flex-col gap-3 mt-4">
          {partyLines.map((partyLine) => (
          <div className="collapse bg-base-100" key={partyLine.name}>
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">{partyLine.name}</div>
            <div className="collapse-content">
              <p>Last Event: {partyLine.lastEvent}</p>
              <p>Last Activity: {new Date(partyLine.lastActivity).toLocaleString("en-GB")}</p>
              <br/>
              <div>
                <strong>Clients:</strong>
                <ul className="list-disc list-inside">
                  {partyLine.clients.map((client) => (
                    <li key={client.clientId}>
                      Client ID: {client.clientId} - IP Address: {client.ipAddress}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3">
                <button className="btn btn-outline btn-error" onClick={() => { deletePartyLine(partyLine.name) }}>
                  Delete PartyLine
                </button>
              </div>
            </div>
          </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default Status;