import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HostelManagement from './pages/HostelManagement.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HostelManagement />
  </StrictMode>,
)
