import React, { useState, useEffect } from 'react'
import axios from 'axios'

function RouteBuilder() {
  const [routes, setRoutes] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    route_type: 'navigation',
    waypoints: [
      { name: '', latitude: '', longitude: '', elevation: 0, description: '' }
    ]
  })

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('/api/routes/list')
      setRoutes(response.data)
    } catch (error) {
      console.error('Error fetching routes:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/routes/create', formData)
      alert('Route created successfully!')
      fetchRoutes()
      setFormData({
        name: '',
        description: '',
        route_type: 'navigation',
        waypoints: [{ name: '', latitude: '', longitude: '', elevation: 0, description: '' }]
      })
    } catch (error) {
      console.error('Error creating route:', error)
      alert('Failed to create route')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleWaypointChange = (index, field, value) => {
    const newWaypoints = [...formData.waypoints]
    newWaypoints[index][field] = value
    setFormData({
      ...formData,
      waypoints: newWaypoints
    })
  }

  const addWaypoint = () => {
    setFormData({
      ...formData,
      waypoints: [
        ...formData.waypoints,
        { name: '', latitude: '', longitude: '', elevation: 0, description: '' }
      ]
    })
  }

  const removeWaypoint = (index) => {
    const newWaypoints = formData.waypoints.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      waypoints: newWaypoints
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1>Route Package Builder</h1>
        <p>Create navigation routes with waypoints</p>
      </div>

      <div className="card">
        <h2>Create New Route</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Route Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Patrol Route Alpha"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              placeholder="Route description..."
            />
          </div>

          <div className="form-group">
            <label>Route Type</label>
            <select name="route_type" value={formData.route_type} onChange={handleChange}>
              <option value="navigation">Navigation</option>
              <option value="patrol">Patrol</option>
              <option value="recon">Reconnaissance</option>
            </select>
          </div>

          <h3>Waypoints</h3>
          {formData.waypoints.map((waypoint, index) => (
            <div key={index} style={{
              background: '#0f172a',
              padding: '16px',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                <h4>Waypoint {index + 1}</h4>
                {formData.waypoints.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{padding: '4px 12px', fontSize: '12px'}}
                    onClick={() => removeWaypoint(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={waypoint.name}
                    onChange={(e) => handleWaypointChange(index, 'name', e.target.value)}
                    required
                    placeholder="Waypoint name"
                  />
                </div>
                <div className="form-group">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={waypoint.latitude}
                    onChange={(e) => handleWaypointChange(index, 'latitude', parseFloat(e.target.value))}
                    required
                    placeholder="38.8951"
                  />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={waypoint.longitude}
                    onChange={(e) => handleWaypointChange(index, 'longitude', parseFloat(e.target.value))}
                    required
                    placeholder="-77.0364"
                  />
                </div>
                <div className="form-group">
                  <label>Elevation (m)</label>
                  <input
                    type="number"
                    step="any"
                    value={waypoint.elevation}
                    onChange={(e) => handleWaypointChange(index, 'elevation', parseFloat(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="action-buttons">
            <button type="button" className="btn btn-secondary" onClick={addWaypoint}>
              Add Waypoint
            </button>
            <button type="submit" className="btn btn-success">
              Create Route
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Created Routes</h2>
        {routes.length === 0 ? (
          <p style={{color: '#64748b'}}>No routes created yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Path</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id}>
                  <td>{route.id}</td>
                  <td>{route.name}</td>
                  <td style={{fontSize: '12px', color: '#64748b'}}>{route.path}</td>
                  <td>
                    <button className="btn btn-primary" style={{padding: '6px 12px', fontSize: '12px'}}>
                      Download
                    </button>
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

export default RouteBuilder
