from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.producto import Producto

class Variante(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
    precio: float
    imagen: str
    stock: int
    cantidad: int #cantidad de contenido en ml
    
    id_producto: Optional[int] = Field(default=None, foreign_key="producto.id")
    
    producto: Optional["Producto"] = Relationship(back_populates="variantes")