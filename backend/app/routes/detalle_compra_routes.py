from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.models.detalle_compra import DetalleCompra
from app.database import get_session

router = APIRouter()

@router.get("/detalle_compras")
def get_detalle_compras(session: Session = Depends(get_session)):
    detalleCompra = session.query(DetalleCompra).all()
    return detalleCompra
        

@router.post("/detalle_compras")
def add_detalle_compras(detalleCompra: DetalleCompra, session: Session = Depends(get_session)):
    session.add(detalleCompra)
    session.commit()
    session.refresh()
    return detalleCompra

@router.put("/detalle_compras/{detalle_id}")
def update_detalle_compra(detalle_id: int, detalleCompra: DetalleCompra, session: Session = Depends(get_session)):
    existing_detalle = session.query(DetalleCompra).filter(DetalleCompra.id == detalle_id).first()
    if not existing_detalle:
        return {"error": "DetalleCompra not found"}
    
    for key, value in detalleCompra.dict().items():
        setattr(existing_detalle, key, value)
    
    session.commit()
    session.refresh(existing_detalle)
    return existing_detalle

@router.delete("/detalle_compras/{detalle_id}")
def delete_detalle_compra(detalle_id: int, session: Session = Depends(get_session)):
    detalleCompra = session.query(DetalleCompra).filter(DetalleCompra.id == detalle_id).first()
    if not detalleCompra:
        return {"error": "DetalleCompra not found"}
    
    session.delete(detalleCompra)
    session.commit()
    return {"message": "DetalleCompra deleted successfully"}