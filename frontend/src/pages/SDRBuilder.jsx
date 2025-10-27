import React, { useState, useEffect } from 'react'
import axios from 'axios'

function SDRBuilder() {
  const [sdrs, setSdrs] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    checkpoints: [
      { name: '', latitude: '', longitude: '', observation_type: 'observation', notes: '', threat_level: 'low' }
    ],
    area_of_interest: {}
  })

  useEffect(() => {
    fetchSDRs()
  }, [])

  const fetchSDRs = async () => {
    try {
      const response = await axios.get('/api/sdr/list')
      setSdrs(response.data)
    } catch (error) {
      console.error('Error fetching SDRs:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/sdr/create', formData)
      alert('SDR created successfully!')
      fetchSDRs()
      setFormData({
        name: '',
        description: '',
        checkpoints: [
          { name: '', latitude: '', longitude: '', observation_type: 'observation', notes: '', threat_level: 'low' }
        ],
        area_of_interest: {}
      })
    } catch (error) {
      console.error('Error creating SDR:', error)
      alert('Failed to create SDR')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleCheckpointChange = (index, field, value) => {
    const newCheckpoints = [...formData.checkpoints]
    newCheckpoints[index][field] = value
    setFormData({
      ...formData,
      checkpoints: newCheckpoints
    })
  }

  const addCheckpoint = () => {
    setFormData({
      ...formData,
      checkpoints: [
        ...formData.checkpoints,
        { name: '', latitude: '', longitude: '', observation_type: 'observation', notes: '', threat_level: 'low' }
      ]
    })
  }

  const removeCheckpoint = (index) => {
    const newCheckpoints = formData.checkpoints.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      checkpoints: newCheckpoints
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1>SDR Builder</h1>
        <p>Create Surveillance Detection Routes with observation checkpoints</p>
      </div>

      <div className="card">
        <h2>Create New SDR</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>SDR Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="SDR Route Alpha"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              placeholder="SDR description and purpose..."
            />
          </div>

          <h3>Observation Checkpoints</h3>
          {formData.checkpoints.map((checkpoint, index) => (
            <div key={index} style={{
              background: '#0f172a',
              padding: '16px',
              borderRadius: '6px',
              marginBottom: '16px',
              border: checkpoint.threat_level === 'high' ? '2px solid #ef4444' :
                     checkpoint.threat_level === 'medium' ? '2px solid #f59e0b' :
                     '2px solid #334155'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                <h4>Checkpoint {index + 1}</h4>
                {formData.checkpoints.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{padding: '4px 12px', fontSize: '12px'}}
                    onClick={() => removeCheckpoint(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Checkpoint Name</label>
                  <input
                    type="text"
                    value={checkpoint.name}
                    onChange={(e) => handleCheckpointChange(index, 'name', e.target.value)}
                    required
                    placeholder="Checkpoint name"
                  />
                </div>
                <div className="form-group">
                  <label>Observation Type</label>
                  <select
                    value={checkpoint.observation_type}
                    onChange={(e) => handleCheckpointChange(index, 'observation_type', e.target.value)}
                  >
                    <option value="surveillance">Surveillance</option>
                    <option value="observation">Observation</option>
                    <option value="checkpoint">Checkpoint</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={checkpoint.latitude}
                    onChange={(e) => handleCheckpointChange(index, 'latitude', parseFloat(e.target.value))}
                    required
                    placeholder="38.8951"
                  />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={checkpoint.longitude}
                    onChange={(e) => handleCheckpointChange(index, 'longitude', parseFloat(e.target.value))}
                    required
                    placeholder="-77.0364"
                  />
                </div>
                <div className="form-group">
                  <label>Threat Level</label>
                  <select
                    value={checkpoint.threat_level}
                    onChange={(e) => handleCheckpointChange(index, 'threat_level', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={checkpoint.notes}
                    onChange={(e) => handleCheckpointChange(index, 'notes', e.target.value)}
                    rows="2"
                    placeholder="Observation notes..."
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="action-buttons">
            <button type="button" className="btn btn-secondary" onClick={addCheckpoint}>
              Add Checkpoint
            </button>
            <button type="submit" className="btn btn-success">
              Create SDR
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Created SDRs</h2>
        {sdrs.length === 0 ? (
          <p style={{color: '#64748b'}}>No SDRs created yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Checkpoints</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sdrs.map((sdr) => (
                <tr key={sdr.id}>
                  <td>{sdr.id}</td>
                  <td>{sdr.name}</td>
                  <td>{sdr.checkpoint_count}</td>
                  <td>
                    <button className="btn btn-primary" style={{padding: '6px 12px', fontSize: '12px'}}>
                      View Details
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

export default SDRBuilder
