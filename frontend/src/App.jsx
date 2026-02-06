import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import AddStructure from './pages/AddStructure'
import SearchStructures from './pages/SearchStructures'
import SearchElements from './pages/SearchElements'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/add" element={<AddStructure />} />
        <Route path="/structures" element={<SearchStructures />} />
        <Route path="/elements" element={<SearchElements />} />
        <Route path="*" element={<Navigate to="/structures" replace />} />
      </Routes>
    </>
  )
}

export default App
