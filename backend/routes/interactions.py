from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models import Interaction
from schemas import InteractionCreate, InteractionUpdate, InteractionResponse

router = APIRouter(prefix="/api/interactions", tags=["interactions"])

def parse_dt(value):
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    for fmt in ["%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M"]:
        try:
            return datetime.strptime(str(value), fmt)
        except ValueError:
            continue
    return datetime.now()

def to_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in ("yes", "true", "1")
    return False

@router.get("/", response_model=List[InteractionResponse])
def get_interactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    interactions = db.query(Interaction).order_by(Interaction.interaction_date.desc()).offset(skip).limit(limit).all()
    return interactions

@router.get("/search/", response_model=List[InteractionResponse])
def search_interactions(hcp_name: str = None, keyword: str = None, db: Session = Depends(get_db)):
    query = db.query(Interaction)
    
    if hcp_name:
        query = query.filter(Interaction.hcp_name.ilike(f"%{hcp_name}%"))
    if keyword:
        query = query.filter(Interaction.notes.ilike(f"%{keyword}%"))
    
    return query.order_by(Interaction.interaction_date.desc()).limit(20).all()

@router.get("/{interaction_id}", response_model=InteractionResponse)
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction

@router.post("/", response_model=InteractionResponse)
def create_interaction(interaction: InteractionCreate, db: Session = Depends(get_db)):
    db_interaction = Interaction(
        hcp_name=interaction.hcp_name,
        hcp_email=interaction.hcp_email,
        hcp_specialty=interaction.hcp_specialty,
        hcp_organization=interaction.hcp_organization,
        interaction_type=interaction.interaction_type,
        interaction_date=parse_dt(interaction.interaction_date),
        notes=interaction.notes,
        follow_up_required=to_bool(interaction.follow_up_required),
        follow_up_date=parse_dt(interaction.follow_up_date)
    )
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.put("/{interaction_id}", response_model=InteractionResponse)
def update_interaction(interaction_id: int, interaction: InteractionUpdate, db: Session = Depends(get_db)):
    db_interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not db_interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    update_data = interaction.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key in ("interaction_date", "follow_up_date"):
            value = parse_dt(value)
        if key == "follow_up_required":
            value = to_bool(value)
        setattr(db_interaction, key, value)
    
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.delete("/{interaction_id}")
def delete_interaction(interaction_id: int, db: Session = Depends(get_db)):
    db_interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not db_interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    db.delete(db_interaction)
    db.commit()
    return {"message": "Interaction deleted successfully"}
