from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.models.variante import Variante
from app.database import get_session

router = APIRouter()

@router.get("/variantes")
def get_variante(session: Session = Depends(get_session)):
    variantes = session.query(Variante).all()
    return variantes

@router.post("/variantes")
def add_variante(variante: Variante, session: Session = Depends(get_session)):
    session.add(variante)
    session.commit()
    session.refresh(variante)
    return variante

@router.put("/variantes/{variante_id}")
def update_variante(variante_id: int, variante: Variante, session: Session = Depends(get_session)):
    existing_variante = session.get(Variante, variante_id)
    if not existing_variante:
        raise HTTPException(status_code=404, detail="Variante no encontrada")

    variante_data = variante.dict(exclude_unset=True)
    for key, value in variante_data.items():
        setattr(existing_variante, key, value)

    session.commit()
    session.refresh(existing_variante)
    return existing_variante

@router.delete("/variantes/{variante_id}")
def delete_variante(variante_id: int, session: Session = Depends(get_session)):
    variante = session.get(Variante, variante_id)
    if not variante:
        raise HTTPException(status_code=404, detail="Variante no encontrada")

    session.delete(variante)
    session.commit()
    return {"message": "Variante eliminada correctamente"}
