from typing import Optional
from sqlmodel import SQLModel

class CategoriaRead(SQLModel):
    id: int
    nombre: str

class ProductoRead(SQLModel):
    id: int
    nombre: str
    descripcion: str
    categoria: Optional[CategoriaRead] = None
    
class VarianteRead(SQLModel):
    id: int
    imagen: str
    precio: float
    stock: int
    cantidad: int
    producto: Optional[ProductoRead] = None
