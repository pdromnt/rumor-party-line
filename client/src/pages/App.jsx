import Navbar from "../components/NavBar.jsx";
import View from "../components/View.jsx";
import Join from "../components/Join.jsx";


const App = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar/>
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-6">
        <div className="flex flex-col gap-6">
          <Join/>
          <View/>
        </div>
      </main>
    </div>
  )
}

export default App
