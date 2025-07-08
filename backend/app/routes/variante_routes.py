from fastapi import APIRouter
from sqlmodel import Session
from app.models.variante import Variante
from app.database import engine

router = APIRouter()

@router.get("/variantes")
def get_variante():
    with Session(engine) as session:
        variante = session.query(Variante).all()
        return variante

@router.post("/variantes")
def add_variante(variante: Variante):
    with Session(engine) as session:
        session.add(variante)
        session.commit()
        return variante
