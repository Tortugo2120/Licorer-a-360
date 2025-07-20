from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
import datetime
from app.models.detalle_compra import DetalleCompra

if TYPE_CHECKING:
    from app.models.variante import Variante
    from app.models.usuario import Usuario

class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fecha: datetime.date
    total: float
    
    id_usuario: Optional[int] = Field(default=None, foreign_key="usuario.id")
    variantes: list["Variante"] = Relationship(back_populates="compras", link_model=DetalleCompra)
    
    detalles: list["DetalleCompra"] = Relationship(back_populates="compra")
    usuario: Optional["Usuario"] = Relationship(back_populates="compras")