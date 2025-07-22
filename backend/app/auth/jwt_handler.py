from datetime import datetime, timedelta 
from jose import jwt, JWTError 
from fastapi import Depends, HTTPException 
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from app.models.usuario import Usuario
from app.database import get_session

# Configuración del token
SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Ruta del endpoint para obtener el token
# Asegúrate de que esta ruta coincida con la definida en tu endpoint /auth/login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Crear un token JWT con expiración
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # Asegúrate de que 'sub' esté incluido en el token si luego lo vas a extraer
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Obtener el usuario actual a partir del token JWT
def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> Usuario:
    credentials_exception = HTTPException(
        status_code=401,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")  # sub es donde se suele guardar el email o username
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = session.exec(select(Usuario).where(Usuario.correo == email)).first()
    if user is None:
        raise credentials_exception

    return user
