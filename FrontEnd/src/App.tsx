import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import SpaceImages from './pages/SpaceImages'
import './App.css'

function App() {

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/space-images" element={<SpaceImages />} />
        </Routes>
      </main>
    </>
  )
}

export default App
