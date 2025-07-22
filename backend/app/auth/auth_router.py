from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models.usuario import Usuario
from app.schemas.user_schema import UsuarioCreate, UsuarioLogin, TokenResponse, UsuarioRead
from app.utils.security import hash_password, verify_password
from app.auth.jwt_handler import create_access_token

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

@auth_router.post("/register", response_model=UsuarioRead)
def register(user: UsuarioCreate, session: Session = Depends(get_session)):
    # Verifica si el correo ya está registrado
    existing = session.exec(select(Usuario).where(Usuario.correo == user.correo)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Correo ya registrado")

    hashed_pass = hash_password(user.contrasena)
    db_user = Usuario(
        nombres=user.nombres,
        apellidos=user.apellidos,
        correo=user.correo,
        contrasena=hashed_pass,
        dni=user.dni
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


@auth_router.post("/login", response_model=TokenResponse)
def login(data: UsuarioLogin, session: Session = Depends(get_session)):
    user = session.exec(select(Usuario).where(Usuario.correo == data.correo)).first()
    if not user or not verify_password(data.contrasena, user.contrasena):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_access_token({"sub": user.correo})
    return {"access_token": token, "token_type": "bearer"}
