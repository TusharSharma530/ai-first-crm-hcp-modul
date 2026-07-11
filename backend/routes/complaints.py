from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Complaint
from schemas import ComplaintCreate, ComplaintUpdate, ComplaintResponse

router = APIRouter(prefix="/api/complaints", tags=["complaints"])


@router.get("/", response_model=List[ComplaintResponse])
def list_complaints(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).all()
    return complaints


@router.post("/", response_model=ComplaintResponse, status_code=201)
def create_complaint(data: ComplaintCreate, db: Session = Depends(get_db)):
    complaint = Complaint(
        subject=data.subject,
        description=data.description,
        category=data.category,
        priority=data.priority,
        assignee=data.assignee,
        reporter_name=data.reporter_name,
        reporter_email=data.reporter_email,
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint


@router.put("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(complaint_id: int, data: ComplaintUpdate, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(complaint, field, value)
    db.commit()
    db.refresh(complaint)
    return complaint


@router.delete("/{complaint_id}", status_code=204)
def delete_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    db.delete(complaint)
    db.commit()
