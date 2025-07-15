# Punto de entrada de la app (ejecuta el servidor)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.producto_routes import router as producto_router
from app.routes.categoria_routes import router as categoria_router
from app.routes.variante_routes import router as variante_router
from app.routes.compra_routes import router as compra_router
from app.routes.detalle_compra_routes import router as detalle_compra_router

from app.database import init_db

app = FastAPI()

#
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or ["*"] for all origins during local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


routes = [producto_router,categoria_router,variante_router,compra_router,detalle_compra_router]

for i in routes:
    app.include_router(i)

#Inicializaion de la base de datos
init_db()