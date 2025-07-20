from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.models.usuario import Usuario
from app.database import get_session

router = APIRouter()

@router.get("/usuarios")
def get_usuario(session: Session = Depends(get_session)):
    usuario = session.query(Usuario).all()
    return usuario

@router.post("/usuarios")
def add_usuario(usuario: Usuario, session: Session = Depends(get_session)):
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    return usuario

@router.put("/usuarios/{usuario_id}")
def update_usuario(usuario_id: int, usuario: Usuario, session: Session = Depends(get_session)):
    existing_usuario = session.get(Usuario, usuario_id)
    if not existing_usuario:
        return {"error": "Usuario no encontrado"}
    existing_usuario.nombre = usuario.nombre
    existing_usuario.email = usuario.email
    session.commit()
    session.refresh(existing_usuario)
    return existing_usuario

