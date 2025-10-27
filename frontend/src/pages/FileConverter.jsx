import React, { useState } from 'react'
import axios from 'axios'

function FileConverter() {
  const [converting, setConverting] = useState(false)
  const [result, setResult] = useState(null)

  const handleKmlToKmz = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setConverting(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/convert/kml-to-kmz', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(response.data)
      alert('Conversion successful!')
    } catch (error) {
      console.error('Error converting file:', error)
      alert('Conversion failed')
    } finally {
      setConverting(false)
    }
  }

  const handleKmzToKml = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setConverting(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/convert/kmz-to-kml', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(response.data)
      alert('Conversion successful!')
    } catch (error) {
      console.error('Error converting file:', error)
      alert('Conversion failed')
    } finally {
      setConverting(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>File Converter</h1>
        <p>Convert between KML and KMZ formats</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>KML to KMZ</h2>
          <p style={{color: '#94a3b8', marginBottom: '20px', fontSize: '14px'}}>
            Convert KML files to compressed KMZ format
          </p>
          <div className="form-group">
            <label>Select KML File</label>
            <input
              type="file"
              accept=".kml"
              onChange={handleKmlToKmz}
              disabled={converting}
              style={{padding: '10px'}}
            />
          </div>
          {converting && <p style={{color: '#3b82f6'}}>Converting...</p>}
        </div>

        <div className="card">
          <h2>KMZ to KML</h2>
          <p style={{color: '#94a3b8', marginBottom: '20px', fontSize: '14px'}}>
            Extract KML from compressed KMZ archive
          </p>
          <div className="form-group">
            <label>Select KMZ File</label>
            <input
              type="file"
              accept=".kmz"
              onChange={handleKmzToKml}
              disabled={converting}
              style={{padding: '10px'}}
            />
          </div>
          {converting && <p style={{color: '#3b82f6'}}>Converting...</p>}
        </div>
      </div>

      {result && (
        <div className="card">
          <h2>Conversion Result</h2>
          <div style={{background: '#0f172a', padding: '16px', borderRadius: '6px'}}>
            <p><strong>Original File:</strong> {result.original_file}</p>
            <p><strong>Converted File:</strong> {result.converted_file}</p>
            <p><strong>Download Path:</strong> {result.download_path}</p>
            <div style={{marginTop: '16px'}}>
              <button className="btn btn-success">
                Download Converted File
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2>About File Formats</h2>
        <div className="grid grid-2">
          <div>
            <h3>KML (Keyhole Markup Language)</h3>
            <p style={{color: '#94a3b8', fontSize: '14px', lineHeight: '1.6'}}>
              XML-based format for expressing geographic annotation and visualization. 
              Used extensively in TAK applications for sharing location data, routes, 
              and overlays. Human-readable and editable.
            </p>
          </div>
          <div>
            <h3>KMZ (Keyhole Markup Zipped)</h3>
            <p style={{color: '#94a3b8', fontSize: '14px', lineHeight: '1.6'}}>
              Compressed archive containing KML file(s) and supporting resources like 
              images. Smaller file size for easier distribution. Better for sharing 
              complete packages with embedded media.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileConverter
