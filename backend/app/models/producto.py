from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.categoria import Categoria
    from app.models.variante import Variante

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    descripcion: str
    
    id_categoria: Optional[int] = Field(default=None, foreign_key="categoria.id")
    
    categoria: Optional["Categoria"] = Relationship(back_populates="productos")
    
    variantes: list["Variante"] = Relationship(back_populates="producto")
    