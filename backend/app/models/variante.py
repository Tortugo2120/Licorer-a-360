from typing import Optional
from sqlmodel import SQLModel, Field

class Variante(SQLModel, table=True):
    __tablename__ = "variantes"
    id: Optional[int] = Field(primary_key=True,index=True)
    precio: float
    stock: int
    cantidad: int #cantidad de contenido en ml
    imagen: str