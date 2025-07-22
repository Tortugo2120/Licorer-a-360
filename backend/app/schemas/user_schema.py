from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class UsuarioCreate(BaseModel):
    nombres: str
    apellidos: str
    correo: EmailStr
    contrasena: str
    dni: str

class UsuarioRead(BaseModel):
    id: int
    nombres: str
    apellidos: str
    correo: EmailStr
    fecha_registro: date
    dni: str

    class Config:
        orm_mode = True

# Para login
class UsuarioLogin(BaseModel):
    correo: EmailStr
    contrasena: str

# Para respuesta con token
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
