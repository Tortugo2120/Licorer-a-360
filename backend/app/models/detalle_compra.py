from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.models.compra import Compra
    from app.models.variante import Variante

class DetalleCompra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    cantidad: int
    subtotal: float
    
    id_compra: Optional[int] = Field(default=None, foreign_key="compra.id")
    id_variante: Optional[int] = Field(default=None, foreign_key="variante.id")
    
    compra: Optional["Compra"] = Relationship(back_populates="detalles")
    variante: Optional["Variante"] = Relationship(back_populates="detalles")