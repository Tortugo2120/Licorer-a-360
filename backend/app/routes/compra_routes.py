from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.models.compra import Compra
from app.database import get_session

router = APIRouter()

@router.get("/compras")
def get_compras(session: Session = Depends(get_session)):
    productos = session.query(Compra).all()
    return productos
        

@router.post("/compras")
def add_compras(compra: Compra, session: Session = Depends(get_session)):
    session.add(compra)
    session.commit()
    session.refresh()
    return compra

@router.put("/compras/{compra_id}")
def update_compra(compra_id: int, compra: Compra, session: Session = Depends(get_session)):
    existing_compra = session.query(Compra).filter(Compra.id == compra_id).first()
    if not existing_compra:
        return {"error": "Compra not found"}
    
    for key, value in compra.dict().items():
        setattr(existing_compra, key, value)
    
    session.commit()
    session.refresh(existing_compra)
    return existing_compra

@router.delete("/compras/{compra_id}")
def delete_compra(compra_id: int, session: Session = Depends(get_session)):
    compra = session.query(Compra).filter(Compra.id == compra_id).first()
    if not compra:
        return {"error": "Compra not found"}
    
    session.delete(compra)
    session.commit()
    return {"message": "Compra deleted successfully"}
