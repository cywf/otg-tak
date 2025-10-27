import React, { useState, useEffect } from 'react'
import axios from 'axios'

function POITracker() {
  const [pois, setPois] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    latitude: '',
    longitude: '',
    metadata: {}
  })

  useEffect(() => {
    fetchPOIs()
  }, [])

  const fetchPOIs = async () => {
    try {
      const response = await axios.get('/api/poi/list')
      setPois(response.data)
    } catch (error) {
      console.error('Error fetching POIs:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/poi/create', formData)
      alert('POI added successfully!')
      setShowForm(false)
      fetchPOIs()
      setFormData({
        name: '',
        description: '',
        category: 'general',
        latitude: '',
        longitude: '',
        metadata: {}
      })
    } catch (error) {
      console.error('Error creating POI:', error)
      alert('Failed to add POI')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const deletePOI = async (id) => {
    if (!confirm('Are you sure you want to delete this POI?')) return
    
    try {
      await axios.delete(`/api/poi/${id}`)
      fetchPOIs()
    } catch (error) {
      console.error('Error deleting POI:', error)
      alert('Failed to delete POI')
    }
  }

  const categories = ['general', 'suspect', 'witness', 'target', 'friendly', 'neutral']

  return (
    <div>
      <div className="page-header">
        <h1>POI Tracker</h1>
        <p>Track and manage Persons of Interest</p>
      </div>

      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2>Persons of Interest</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add POI'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="form-container" style={{marginTop: '20px'}}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Physical description, identifying features, known associates..."
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label>Latitude (Optional)</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="38.8951"
                />
              </div>

              <div className="form-group">
                <label>Longitude (Optional)</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="-77.0364"
                />
              </div>
            </div>

            <div className="action-buttons">
              <button type="submit" className="btn btn-success">
                Add POI
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <h2>POI List ({pois.length})</h2>
        {pois.length === 0 ? (
          <p style={{color: '#64748b'}}>No POIs tracked yet. Add your first POI above.</p>
        ) : (
          <div className="grid grid-3">
            {pois.map((poi) => (
              <div key={poi.id} style={{
                background: '#0f172a',
                padding: '16px',
                borderRadius: '6px',
                border: '1px solid #334155'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px'}}>
                  <h3 style={{margin: 0}}>{poi.name}</h3>
                  <span className={`badge badge-${
                    poi.category === 'suspect' || poi.category === 'target' ? 'danger' :
                    poi.category === 'friendly' ? 'success' :
                    'info'
                  }`}>
                    {poi.category}
                  </span>
                </div>
                <p style={{color: '#94a3b8', fontSize: '14px', marginBottom: '12px'}}>
                  {poi.description || 'No description provided'}
                </p>
                {(poi.latitude && poi.longitude) && (
                  <p style={{color: '#64748b', fontSize: '12px', marginBottom: '12px'}}>
                    📍 {poi.latitude}, {poi.longitude}
                  </p>
                )}
                <div className="action-buttons">
                  <button 
                    className="btn btn-danger" 
                    style={{padding: '6px 12px', fontSize: '12px'}}
                    onClick={() => deletePOI(poi.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default POITracker
