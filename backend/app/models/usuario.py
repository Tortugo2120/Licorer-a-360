from typing import Optional, TYPE_CHECKING
import datetime
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.compra import Compra

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombres: str
    apellidos: str
    correo: str
    contrasena: str
    fecha_registro: datetime.date = Field(default_factory=datetime.date.today)
    dni: str
    
    compras: list["Compra"] = Relationship(back_populates="usuario")