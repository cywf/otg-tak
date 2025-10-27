import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Deployment() {
  const [deployments, setDeployments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    deployment_type: 'local',
    tak_server_config: {},
    security_config: {},
    networking_config: {},
    enable_tailscale: false,
    enable_zerotier: false,
    enable_traefik: true,
    enable_mediamtx: false
  })

  useEffect(() => {
    fetchDeployments()
  }, [])

  const fetchDeployments = async () => {
    try {
      const response = await axios.get('/api/deployment/list')
      setDeployments(response.data)
    } catch (error) {
      console.error('Error fetching deployments:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/deployment/create', formData)
      setShowForm(false)
      fetchDeployments()
      alert('Deployment started successfully!')
    } catch (error) {
      console.error('Error creating deployment:', error)
      alert('Failed to start deployment')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1>Deployment Manager</h1>
        <p>Manage TAK Server deployments</p>
      </div>

      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2>Deployments</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Deployment'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="form-container" style={{marginTop: '20px'}}>
            <div className="form-group">
              <label>Deployment Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="My TAK Deployment"
              />
            </div>

            <div className="form-group">
              <label>Deployment Type</label>
              <select name="deployment_type" value={formData.deployment_type} onChange={handleChange}>
                <option value="local">Local (Bare Metal)</option>
                <option value="cloud">Cloud (Terraform + Containers)</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="enable_tailscale"
                  checked={formData.enable_tailscale}
                  onChange={handleChange}
                  style={{width: 'auto', marginRight: '8px'}}
                />
                Enable Tailscale
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="enable_zerotier"
                  checked={formData.enable_zerotier}
                  onChange={handleChange}
                  style={{width: 'auto', marginRight: '8px'}}
                />
                Enable Zerotier
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="enable_traefik"
                  checked={formData.enable_traefik}
                  onChange={handleChange}
                  style={{width: 'auto', marginRight: '8px'}}
                />
                Enable Traefik (SSL & Reverse Proxy)
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="enable_mediamtx"
                  checked={formData.enable_mediamtx}
                  onChange={handleChange}
                  style={{width: 'auto', marginRight: '8px'}}
                />
                Enable MediaMTX (ISR Feed)
              </label>
            </div>

            <div className="action-buttons">
              <button type="submit" className="btn btn-success">
                Start Deployment
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <h2>Active Deployments</h2>
        {deployments.length === 0 ? (
          <p style={{color: '#64748b'}}>No deployments yet. Create your first deployment above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((deployment) => (
                <tr key={deployment.id}>
                  <td>{deployment.name}</td>
                  <td>{deployment.deployment_type}</td>
                  <td>
                    <span className={`badge badge-${
                      deployment.status === 'completed' ? 'success' :
                      deployment.status === 'failed' ? 'danger' :
                      deployment.status === 'in_progress' ? 'warning' :
                      'info'
                    }`}>
                      {deployment.status}
                    </span>
                  </td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${deployment.progress}%`}} />
                    </div>
                    <span style={{fontSize: '12px', color: '#64748b'}}>{deployment.progress}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Deployment
