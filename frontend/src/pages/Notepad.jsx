import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Notepad() {
  const [notes, setNotes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    shared: true
  })

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/api/notes/list')
      setNotes(response.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingNote) {
        await axios.put(`/api/notes/${editingNote.id}`, formData)
        alert('Note updated successfully!')
      } else {
        await axios.post('/api/notes/create', formData)
        alert('Note created successfully!')
      }
      setShowForm(false)
      setEditingNote(null)
      fetchNotes()
      setFormData({
        title: '',
        content: '',
        author: '',
        shared: true
      })
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const editNote = (note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      author: note.author,
      shared: note.shared
    })
    setShowForm(true)
  }

  const deleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    
    try {
      await axios.delete(`/api/notes/${id}`)
      fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note')
    }
  }

  const cancelEdit = () => {
    setShowForm(false)
    setEditingNote(null)
    setFormData({
      title: '',
      content: '',
      author: '',
      shared: true
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1>Shared Notepad</h1>
        <p>Collaborative notes accessible to all TAK clients</p>
      </div>

      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2>{editingNote ? 'Edit Note' : 'Create Note'}</h2>
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              New Note
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="form-container" style={{marginTop: '20px'}}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Note title"
              />
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="8"
                required
                placeholder="Note content..."
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Your name (optional)"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="shared"
                  checked={formData.shared}
                  onChange={handleChange}
                  style={{width: 'auto', marginRight: '8px'}}
                />
                Share with all TAK clients
              </label>
            </div>

            <div className="action-buttons">
              <button type="submit" className="btn btn-success">
                {editingNote ? 'Update Note' : 'Create Note'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <h2>Notes ({notes.length})</h2>
        {notes.length === 0 ? (
          <p style={{color: '#64748b'}}>No notes yet. Create your first note above.</p>
        ) : (
          <div className="grid grid-2">
            {notes.map((note) => (
              <div key={note.id} style={{
                background: '#0f172a',
                padding: '20px',
                borderRadius: '6px',
                border: '1px solid #334155'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px'}}>
                  <h3 style={{margin: 0}}>{note.title}</h3>
                  {note.shared && (
                    <span className="badge badge-success">Shared</span>
                  )}
                </div>
                <p style={{color: '#94a3b8', fontSize: '14px', marginBottom: '12px', whiteSpace: 'pre-wrap'}}>
                  {note.content}
                </p>
                <div style={{
                  borderTop: '1px solid #334155',
                  paddingTop: '12px',
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{color: '#64748b', fontSize: '12px', margin: 0}}>
                      By: {note.author}
                    </p>
                    <p style={{color: '#64748b', fontSize: '12px', margin: 0}}>
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-secondary" 
                      style={{padding: '6px 12px', fontSize: '12px'}}
                      onClick={() => editNote(note)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{padding: '6px 12px', fontSize: '12px'}}
                      onClick={() => deleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notepad
