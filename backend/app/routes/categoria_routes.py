from fastapi import APIRouter
from sqlmodel import Session
from app.models.categoria import Categoria
from app.database import engine

router = APIRouter()

@router.get("/categorias")
def get_categoria():
    with Session(engine) as session:
        categoria = session.query(Categoria).all()
        return categoria

@router.post("/categorias")
def add_categoria(categoria: Categoria):
    with Session(engine) as session:
        session.add(categoria)
        session.commit()
        return categoria
