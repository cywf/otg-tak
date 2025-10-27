import React, { useState, useEffect } from 'react'
import axios from 'axios'

function ServerStatus() {
  const [status, setStatus] = useState(null)
  const [services, setServices] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchStatus = async () => {
    try {
      const [statusRes, servicesRes] = await Promise.all([
        axios.get('/api/status/current'),
        axios.get('/api/status/services')
      ])
      setStatus(statusRes.data)
      setServices(servicesRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching status:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Server Status</h1>
          <p>Loading server metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>Server Status</h1>
        <p>Real-time monitoring and system metrics</p>
      </div>

      {status && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>CPU Usage</h3>
              <div className="value">{status.cpu.usage_percent.toFixed(1)}%</div>
              <div className="label">{status.cpu.count} cores available</div>
            </div>
            <div className="stat-card">
              <h3>Memory</h3>
              <div className="value">{status.memory.percent.toFixed(1)}%</div>
              <div className="label">
                {(status.memory.used / 1024 / 1024 / 1024).toFixed(1)} GB / 
                {(status.memory.total / 1024 / 1024 / 1024).toFixed(1)} GB
              </div>
            </div>
            <div className="stat-card">
              <h3>Disk Usage</h3>
              <div className="value">{status.disk.percent.toFixed(1)}%</div>
              <div className="label">
                {(status.disk.used / 1024 / 1024 / 1024).toFixed(1)} GB / 
                {(status.disk.total / 1024 / 1024 / 1024).toFixed(1)} GB
              </div>
            </div>
            <div className="stat-card">
              <h3>Network</h3>
              <div className="value">{(status.network.bytes_recv / 1024 / 1024).toFixed(0)} MB</div>
              <div className="label">Data received</div>
            </div>
          </div>

          <div className="card">
            <h2>System Resources</h2>
            <div style={{marginBottom: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <span>CPU</span>
                <span>{status.cpu.usage_percent.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{
                    width: `${status.cpu.usage_percent}%`,
                    background: status.cpu.usage_percent > 80 ? '#ef4444' : 
                               status.cpu.usage_percent > 60 ? '#f59e0b' : '#10b981'
                  }} 
                />
              </div>
            </div>

            <div style={{marginBottom: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <span>Memory</span>
                <span>{status.memory.percent.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{
                    width: `${status.memory.percent}%`,
                    background: status.memory.percent > 80 ? '#ef4444' : 
                               status.memory.percent > 60 ? '#f59e0b' : '#10b981'
                  }} 
                />
              </div>
            </div>

            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <span>Disk</span>
                <span>{status.disk.percent.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{
                    width: `${status.disk.percent}%`,
                    background: status.disk.percent > 80 ? '#ef4444' : 
                               status.disk.percent > 60 ? '#f59e0b' : '#10b981'
                  }} 
                />
              </div>
            </div>
          </div>
        </>
      )}

      {services && (
        <div className="card">
          <h2>Services Status</h2>
          <div className="grid grid-2">
            <div style={{background: '#0f172a', padding: '16px', borderRadius: '6px'}}>
              <h3>TAK Server</h3>
              <p style={{color: '#94a3b8'}}>
                Status: <span className={`badge badge-${services.tak_server.status === 'running' ? 'success' : 'danger'}`}>
                  {services.tak_server.status}
                </span>
              </p>
              <p style={{color: '#94a3b8'}}>Port: {services.tak_server.port}</p>
              <p style={{color: '#94a3b8'}}>Active Connections: {services.tak_server.active_connections}</p>
            </div>

            <div style={{background: '#0f172a', padding: '16px', borderRadius: '6px'}}>
              <h3>Traefik</h3>
              <p style={{color: '#94a3b8'}}>
                Status: <span className={`badge badge-${services.traefik.status === 'running' ? 'success' : 'danger'}`}>
                  {services.traefik.status}
                </span>
              </p>
              <p style={{color: '#94a3b8'}}>HTTPS: {services.traefik.https_enabled ? 'Enabled' : 'Disabled'}</p>
            </div>

            <div style={{background: '#0f172a', padding: '16px', borderRadius: '6px'}}>
              <h3>MediaMTX</h3>
              <p style={{color: '#94a3b8'}}>
                Status: <span className={`badge badge-${services.mediamtx.status === 'running' ? 'success' : 'warning'}`}>
                  {services.mediamtx.status}
                </span>
              </p>
              <p style={{color: '#94a3b8'}}>Active Streams: {services.mediamtx.streams}</p>
            </div>

            <div style={{background: '#0f172a', padding: '16px', borderRadius: '6px'}}>
              <h3>Tailscale</h3>
              <p style={{color: '#94a3b8'}}>
                Status: <span className={`badge badge-${services.tailscale.status === 'connected' ? 'success' : 'warning'}`}>
                  {services.tailscale.status}
                </span>
              </p>
              <p style={{color: '#94a3b8'}}>Network: {services.tailscale.network}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServerStatus
