import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import SpaceImages from './pages/SpaceImages'
import Dogs from './pages/Dogs'
import ColorPalette from './pages/ColorPalette'
import './App.css'

function App() {

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/space-images" element={<SpaceImages />} />
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/color-palette" element={<ColorPalette />} />
        </Routes>
      </main>
    </>
  )
}

export default App
