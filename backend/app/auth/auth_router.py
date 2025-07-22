from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlmodel import Session, select

from app.database import get_session
from app.models.usuario import Usuario
from app.schemas.user_schema import UsuarioCreate, UsuarioLogin, TokenResponse, UsuarioRead
from app.utils.security import hash_password, verify_password
from app.auth.jwt_handler import create_access_token, get_current_user

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

# Registro de nuevo usuario
@auth_router.post("/register", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
def register(user: UsuarioCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(
        select(Usuario).where(Usuario.correo == user.correo)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado"
        )

    hashed_password = hash_password(user.contrasena)
    new_user = Usuario(
        nombres=user.nombres,
        apellidos=user.apellidos,
        correo=user.correo,
        contrasena=hashed_password,
        dni=user.dni
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user

# Inicio de sesión
@auth_router.post("/login", response_model=TokenResponse)
def login(data: UsuarioLogin, session: Session = Depends(get_session)):
    user = session.exec(
        select(Usuario).where(Usuario.correo == data.correo)
    ).first()
    if not user or not verify_password(data.contrasena, user.contrasena):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = create_access_token({"sub": user.correo})
    return {"access_token": token, "token_type": "bearer"}

# Verificar token
@auth_router.get("/verify-token")
def verify_token(user: Annotated[Usuario, Depends(get_current_user)]):
    return {"message": "Token válido", "user": user}

# Obtener información del usuario actual
@auth_router.get("/me", response_model=UsuarioRead)
def get_current_user_info(user: Annotated[Usuario, Depends(get_current_user)]):
    """
    Obtiene la información del usuario autenticado actual.
    Requiere un token de autenticación válido.
    """
    return user