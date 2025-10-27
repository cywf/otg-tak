import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Deployment from './pages/Deployment'
import QRGenerator from './pages/QRGenerator'
import DataPackages from './pages/DataPackages'
import RouteBuilder from './pages/RouteBuilder'
import SDRBuilder from './pages/SDRBuilder'
import FileConverter from './pages/FileConverter'
import ServerStatus from './pages/ServerStatus'
import POITracker from './pages/POITracker'
import Notepad from './pages/Notepad'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <div className="logo">
            <h2>OTG-TAK</h2>
            <p>On-The-Go TAK</p>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/deployment">Deployment</Link></li>
            <li><Link to="/qr-generator">QR Generator</Link></li>
            <li><Link to="/data-packages">Data Packages</Link></li>
            <li><Link to="/route-builder">Route Builder</Link></li>
            <li><Link to="/sdr-builder">SDR Builder</Link></li>
            <li><Link to="/file-converter">File Converter</Link></li>
            <li><Link to="/server-status">Server Status</Link></li>
            <li><Link to="/poi-tracker">POI Tracker</Link></li>
            <li><Link to="/notepad">Notepad</Link></li>
          </ul>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/deployment" element={<Deployment />} />
            <Route path="/qr-generator" element={<QRGenerator />} />
            <Route path="/data-packages" element={<DataPackages />} />
            <Route path="/route-builder" element={<RouteBuilder />} />
            <Route path="/sdr-builder" element={<SDRBuilder />} />
            <Route path="/file-converter" element={<FileConverter />} />
            <Route path="/server-status" element={<ServerStatus />} />
            <Route path="/poi-tracker" element={<POITracker />} />
            <Route path="/notepad" element={<Notepad />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
