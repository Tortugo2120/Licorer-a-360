from typing import Optional
from sqlmodel import SQLModel, Field

class Categoria(SQLModel, table=True):
    __tablename__ = "categorias"
    id: Optional[int] = Field(primary_key=True,index=True)
    nombre: str
    