import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard() {
  const [stats, setStats] = useState({
    deployments: 0,
    activeConnections: 0,
    pois: 0,
    notes: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch various stats from API
      const deploymentsRes = await axios.get('/api/deployment/list')
      const poisRes = await axios.get('/api/poi/list')
      const notesRes = await axios.get('/api/notes/list')
      
      setStats({
        deployments: deploymentsRes.data.length,
        activeConnections: 0, // Would get from server
        pois: poisRes.data.length,
        notes: notesRes.data.length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your OTG-TAK deployment system</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Deployments</h3>
          <div className="value">{stats.deployments}</div>
          <div className="label">Total deployments</div>
        </div>
        <div className="stat-card">
          <h3>Active Connections</h3>
          <div className="value">{stats.activeConnections}</div>
          <div className="label">TAK clients connected</div>
        </div>
        <div className="stat-card">
          <h3>POIs</h3>
          <div className="value">{stats.pois}</div>
          <div className="label">Persons of Interest tracked</div>
        </div>
        <div className="stat-card">
          <h3>Shared Notes</h3>
          <div className="value">{stats.notes}</div>
          <div className="label">Collaborative notes</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Quick Actions</h2>
          <div className="action-buttons" style={{flexDirection: 'column'}}>
            <button className="btn btn-primary" onClick={() => window.location.href = '/deployment'}>
              New Deployment
            </button>
            <button className="btn btn-primary" onClick={() => window.location.href = '/qr-generator'}>
              Generate QR Code
            </button>
            <button className="btn btn-primary" onClick={() => window.location.href = '/data-packages'}>
              Create Data Package
            </button>
            <button className="btn btn-primary" onClick={() => window.location.href = '/poi-tracker'}>
              Add POI
            </button>
          </div>
        </div>

        <div className="card">
          <h2>System Features</h2>
          <ul style={{listStyle: 'none', lineHeight: '2'}}>
            <li>✓ TAK Server Provisioning</li>
            <li>✓ Security Automation (Lynis)</li>
            <li>✓ Networking (Tailscale & Zerotier)</li>
            <li>✓ Traefik SSL & Reverse Proxy</li>
            <li>✓ MediaMTX ISR Feed</li>
            <li>✓ QR Code Client Onboarding</li>
            <li>✓ Data & Route Packages</li>
            <li>✓ SDR Builder</li>
            <li>✓ KML/KMZ Converter</li>
            <li>✓ POI Tracking</li>
            <li>✓ Shared Notepad</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h2>About OTG-TAK</h2>
        <p style={{lineHeight: '1.8', color: '#94a3b8'}}>
          OTG-TAK (On-The-Go TAK) is a comprehensive mobile solution for automating 
          the deployment and setup of TAK Servers. It provides automated provisioning, 
          security hardening, networking integration, and a suite of tactical tools 
          for field operations. Whether deploying on bare metal or in the cloud, 
          OTG-TAK streamlines the entire process with an intuitive dashboard interface.
        </p>
      </div>
    </div>
  )
}

export default Dashboard
