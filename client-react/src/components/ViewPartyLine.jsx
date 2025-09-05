import usePartyLine from "../store/store.js";

const ViewPartyLine = () => {
  const rumor = usePartyLine((state) => state.rumor);

  return (
    <div>
      <br/>
      {rumor ? <span><h4>Rumor has it that...</h4> <h2>{rumor}</h2></span> : null}
    </div>
  )
}

export default ViewPartyLine