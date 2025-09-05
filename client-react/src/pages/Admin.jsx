import Navbar from "../components/NavBar.jsx";
import CreatePartyLine from "../components/CreatePartyLine.jsx";
import SendRumor from "../components/SendRumor.jsx";
import DeletePartyLine from "../components/DeletePartyLine.jsx";

const Admin = () => {
  return (
    <div>
      <Navbar/>
      <CreatePartyLine/>
      <SendRumor/>
      <DeletePartyLine/>
    </div>
  )
}

export default Admin;