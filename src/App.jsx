import Footer from './components/Footer'
import MainSection from './components/MainSection'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar />
      <MainSection />
      <Footer />
    </div>
  )
}
