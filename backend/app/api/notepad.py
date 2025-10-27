"""
Notepad Widget API endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import Note

router = APIRouter()

class NoteRequest(BaseModel):
    title: str
    content: str
    author: Optional[str] = "anonymous"
    shared: bool = True

class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    author: str
    shared: bool
    created_at: str
    updated_at: Optional[str] = None

@router.post("/create", response_model=NoteResponse)
async def create_note(note: NoteRequest, db: AsyncSession = Depends(get_db)):
    """
    Create a new note
    """
    new_note = Note(
        title=note.title,
        content=note.content,
        author=note.author,
        shared=note.shared
    )
    
    db.add(new_note)
    await db.commit()
    await db.refresh(new_note)
    
    return NoteResponse(
        id=new_note.id,
        title=new_note.title,
        content=new_note.content,
        author=new_note.author or "anonymous",
        shared=new_note.shared,
        created_at=new_note.created_at.isoformat(),
        updated_at=new_note.updated_at.isoformat() if new_note.updated_at else None
    )

@router.get("/list")
async def list_notes(
    shared_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """
    List notes (shared or all)
    """
    query = select(Note)
    if shared_only:
        query = query.where(Note.shared == True)
    
    result = await db.execute(query.order_by(Note.created_at.desc()))
    notes = result.scalars().all()
    
    return [
        NoteResponse(
            id=n.id,
            title=n.title,
            content=n.content,
            author=n.author or "anonymous",
            shared=n.shared,
            created_at=n.created_at.isoformat(),
            updated_at=n.updated_at.isoformat() if n.updated_at else None
        )
        for n in notes
    ]

@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(note_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get note details
    """
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return NoteResponse(
        id=note.id,
        title=note.title,
        content=note.content,
        author=note.author or "anonymous",
        shared=note.shared,
        created_at=note.created_at.isoformat(),
        updated_at=note.updated_at.isoformat() if note.updated_at else None
    )

@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int,
    note_update: NoteRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Update note
    """
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    note.title = note_update.title
    note.content = note_update.content
    note.author = note_update.author
    note.shared = note_update.shared
    
    await db.commit()
    await db.refresh(note)
    
    return NoteResponse(
        id=note.id,
        title=note.title,
        content=note.content,
        author=note.author or "anonymous",
        shared=note.shared,
        created_at=note.created_at.isoformat(),
        updated_at=note.updated_at.isoformat() if note.updated_at else None
    )

@router.delete("/{note_id}")
async def delete_note(note_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete note
    """
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    await db.delete(note)
    await db.commit()
    
    return {"message": "Note deleted successfully"}
