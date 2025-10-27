import React, { useState, useEffect } from 'react'
import axios from 'axios'

function DataPackages() {
  const [packages, setPackages] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    files: []
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await axios.get('/api/packages/list')
      setPackages(response.data)
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/packages/create', formData)
      alert('Data package created successfully!')
      fetchPackages()
      setFormData({ name: '', description: '', files: [] })
    } catch (error) {
      console.error('Error creating package:', error)
      alert('Failed to create package')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1>Data Package Builder</h1>
        <p>Create and manage data packages for TAK clients</p>
      </div>

      <div className="card">
        <h2>Create New Package</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Package Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Mission Package Alpha"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Package description..."
            />
          </div>

          <div className="form-group">
            <label>Files</label>
            <p style={{fontSize: '14px', color: '#64748b', marginBottom: '10px'}}>
              Upload files to include in this package
            </p>
            <input type="file" multiple style={{padding: '5px'}} />
          </div>

          <button type="submit" className="btn btn-success">
            Create Package
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Existing Packages</h2>
        {packages.length === 0 ? (
          <p style={{color: '#64748b'}}>No packages created yet.</p>
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
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>{pkg.id}</td>
                  <td>{pkg.name}</td>
                  <td style={{fontSize: '12px', color: '#64748b'}}>{pkg.path}</td>
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

export default DataPackages
