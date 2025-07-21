from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from app.models.detalle_compra import DetalleCompra

if TYPE_CHECKING:
    from app.models.producto import Producto
    from app.models.compra import Compra
    

class Variante(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
    precio: float
    imagen: str
    stock: int
    cantidad: int 
    activo: bool = Field(default=True)
    
    id_producto: Optional[int] = Field(default=None, foreign_key="producto.id")
    
    producto: Optional["Producto"] = Relationship(back_populates="variantes")
    
    detalles: list["DetalleCompra"] = Relationship(back_populates="variante")
    compras: list["Compra"] = Relationship(
        back_populates="variantes", link_model=DetalleCompra
    )