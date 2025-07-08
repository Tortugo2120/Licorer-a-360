from typing import Optional
from sqlmodel import SQLModel, Field

class Producto(SQLModel, table=True):
    __tablename__ = "productos"
    id: Optional[int] = Field(primary_key=True,index=True)
    nombre: str
    descripcion: str
    #id_categoria = Optional[int] = Field(default=None,foreign_key="categorias.id")
    