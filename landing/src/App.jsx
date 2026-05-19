import Nav from './components/shared/Nav'
import Footer from './components/shared/Footer'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090B' }}>
      <Nav />
      <LandingPage />
      <Footer />
    </div>
  )
}
