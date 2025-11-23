import usePartyLine from "../store/store.js";

const View = () => {
  const partyLine = usePartyLine((state) => state.partyLine);
  const rumor = usePartyLine((state) => state.rumor);

  if (!partyLine) return null;

  return (
    <div className="card bg-base-200 p-4 rounded-box w-full text-center">
      {rumor ? <div><h4 className="text-sm">Rumor has it that...</h4><h2 className="text-lg mt-2">{rumor}</h2></div> : <div><small>No rumors yet.</small></div>}
    </div>
  )
}

export default View