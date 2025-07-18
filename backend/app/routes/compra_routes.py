from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.models.compra import Compra
from app.database import get_session

router = APIRouter(
    prefix="/compras",
    tags=["compras"]
)

@router.get("/", response_model=List[Compra])
def get_compras(session: Session = Depends(get_session)):
    """Devuelve todas las compras registradas en la base de datos"""
    compras = session.exec(select(Compra)).all()
    return compras

@router.post("/", response_model=Compra, status_code=status.HTTP_201_CREATED)
def add_compra(compra: Compra, session: Session = Depends(get_session)):
    """Crea una nueva compra con fecha y total"""
    session.add(compra)
    session.commit()
    session.refresh(compra)
    return compra

@router.put("/{compra_id}", response_model=Compra)
def update_compra(compra_id: int, compra: Compra, session: Session = Depends(get_session)):
    """Actualiza los datos de una compra existente"""
    existing = session.get(Compra, compra_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    
    compra_data = compra.dict(exclude_unset=True)
    for key, value in compra_data.items():
        setattr(existing, key, value)
    
    session.add(existing)
    session.commit()
    session.refresh(existing)
    return existing

@router.delete("/{compra_id}")
def delete_compra(compra_id: int, session: Session = Depends(get_session)):
    """Elimina una compra por su ID"""
    existing = session.get(Compra, compra_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    session.delete(existing)
    session.commit()
    return {"message": "Compra eliminada correctamente"}
