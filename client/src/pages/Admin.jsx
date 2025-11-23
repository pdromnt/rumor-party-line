import Navbar from "../components/NavBar.jsx";
import Create from "../components/Create.jsx";
import SendRumor from "../components/SendRumor.jsx";
import Status from "../components/Status.jsx";

const Admin = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar/>
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-6">
        <div className="flex flex-col gap-6">
              <Create/>
              <SendRumor/>
              <Status/>
        </div>
      </main>
    </div>
  )
}

export default Admin;