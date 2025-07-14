from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.models.producto import Producto
from app.database import get_session

router = APIRouter()

@router.get("/productos")
def get_productos(session: Session = Depends(get_session)):
    productos = session.query(Producto).all()
    return productos

@router.post("/productos")
def add_producto(producto: Producto, session: Session = Depends(get_session)):
    session.add(producto)
    session.commit()
    session.refresh(producto)  # para obtener el ID generado
    return producto

@router.get("/productos/{producto_id}")
def get_producto(producto_id: int, session: Session = Depends(get_session)):
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@router.put("/productos/{producto_id}")
def update_producto(producto_id: int, producto: Producto, session: Session = Depends(get_session)):
    existing_producto = session.get(Producto, producto_id)
    if not existing_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    producto_data = producto.dict(exclude_unset=True)
    for key, value in producto_data.items():
        setattr(existing_producto, key, value)

    session.commit()
    session.refresh(existing_producto)
    return existing_producto

@router.delete("/productos/{producto_id}")
def delete_producto(producto_id: int, session: Session = Depends(get_session)):
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    session.delete(producto)
    session.commit()
    return {"message": "Producto eliminado correctamente"}