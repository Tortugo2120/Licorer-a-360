from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.models.categoria import Categoria
from app.database import get_session

router = APIRouter()

@router.get("/categorias")
def get_categoria(session: Session = Depends(get_session)):
    categorias = session.query(Categoria).all()
    return categorias

@router.post("/categorias")
def add_categoria(categoria: Categoria, session: Session = Depends(get_session)):
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria

@router.put("/categorias/{categoria_id}")
def update_categoria(categoria_id: int, categoria: Categoria, session: Session = Depends(get_session)):
    existing_categoria = session.get(Categoria, categoria_id)
    if not existing_categoria:
        return {"error": "Categoría no encontrada"}
    existing_categoria.nombre = categoria.nombre
    session.commit()
    session.refresh(existing_categoria)
    return existing_categoria

@router.delete("/categorias/{categoria_id}")
def delete_categoria(categoria_id: int, session: Session = Depends(get_session)):
    existing_categoria = session.get(Categoria, categoria_id)
    if not existing_categoria:
        return {"error": "Categoría no encontrada"}
    session.delete(existing_categoria)
    session.commit()
    return {"message": "Categoría eliminada correctamente"}
