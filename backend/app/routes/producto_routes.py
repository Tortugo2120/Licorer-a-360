from fastapi import APIRouter
from sqlmodel import Session
from app.models.producto import Producto
from app.database import engine

router = APIRouter()

@router.get("/productos")
def get_productos():
    with Session(engine) as session:
        productos = session.query(Producto).all()
        return productos

@router.post("/productos")
def add_producto(producto: Producto):
    with Session(engine) as session:
        session.add(producto)
        session.commit()
        return producto
