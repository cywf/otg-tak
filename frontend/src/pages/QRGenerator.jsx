import React, { useState } from 'react'
import axios from 'axios'

function QRGenerator() {
  const [formData, setFormData] = useState({
    server_url: '',
    server_port: 8089,
    certificate_data: '',
    username: '',
    password: ''
  })
  const [qrCode, setQrCode] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('/api/qr/generate', formData)
      setQrCode(response.data.qr_code_base64)
    } catch (error) {
      console.error('Error generating QR code:', error)
      alert('Failed to generate QR code')
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrCode) return
    
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${qrCode}`
    link.download = `tak-qr-${formData.username}.png`
    link.click()
  }

  return (
    <div>
      <div className="page-header">
        <h1>QR Code Generator</h1>
        <p>Generate QR codes for quick ATAK/iTAK client onboarding</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Client Configuration</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Server URL</label>
              <input
                type="text"
                name="server_url"
                value={formData.server_url}
                onChange={handleChange}
                required
                placeholder="https://tak.example.com"
              />
            </div>

            <div className="form-group">
              <label>Server Port</label>
              <input
                type="number"
                name="server_port"
                value={formData.server_port}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="client-username"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Certificate Data (Base64)</label>
              <textarea
                name="certificate_data"
                value={formData.certificate_data}
                onChange={handleChange}
                rows="4"
                placeholder="Paste certificate data here..."
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate QR Code'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Generated QR Code</h2>
          {qrCode ? (
            <div>
              <div className="qr-display">
                <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />
              </div>
              <div className="action-buttons" style={{marginTop: '20px'}}>
                <button className="btn btn-success" onClick={downloadQR}>
                  Download QR Code
                </button>
              </div>
              <p style={{marginTop: '20px', color: '#64748b', fontSize: '14px'}}>
                Scan this QR code with ATAK or iTAK to automatically configure the client 
                connection to your TAK server.
              </p>
            </div>
          ) : (
            <p style={{color: '#64748b'}}>
              Fill in the form and click "Generate QR Code" to create a QR code for client onboarding.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default QRGenerator
