from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.variante import Variante
from app.models.schemas import VarianteRead
from app.database import get_session

router = APIRouter()

# --- GET todas las variantes ---
@router.get("/variantes", response_model=list[VarianteRead])
def get_variantes(session: Session = Depends(get_session)):
    variantes = session.exec(select(Variante)).all()
    return variantes

# --- GET una variante por su ID ---
@router.get("/variantes/{variante_id}", response_model=VarianteRead)
def get_variante(variante_id: int, session: Session = Depends(get_session)):
    variante = session.get(Variante, variante_id)
    if not variante:
        raise HTTPException(status_code=404, detail="Variante no encontrada")
    return variante

# --- POST crear variante ---
@router.post("/variantes", response_model=VarianteRead)
def add_variante(variante: Variante, session: Session = Depends(get_session)):
    session.add(variante)
    session.commit()
    session.refresh(variante)
    return variante

# --- PUT actualizar variante (incluye nombre, producto y categoría) ---
@router.put("/variantes/{variante_id}", response_model=VarianteRead)
def update_variante(variante_id: int, variante_in: Variante, session: Session = Depends(get_session)):
    existing = session.get(Variante, variante_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Variante no encontrada")

    # Actualizamos solo los campos que vienen
    variante_data = variante_in.dict(exclude_unset=True)
    for key, val in variante_data.items():
        setattr(existing, key, val)

    session.commit()
    session.refresh(existing)
    return existing

# --- DELETE variante ---
@router.delete("/variantes/{variante_id}")
def delete_variante(variante_id: int, session: Session = Depends(get_session)):
    variante = session.get(Variante, variante_id)
    if not variante:
        raise HTTPException(status_code=404, detail="Variante no encontrada")
    session.delete(variante)
    session.commit()
    return {"message": "Variante eliminada correctamente"}
