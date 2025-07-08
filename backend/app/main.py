# Punto de entrada de la app (ejecuta el servidor)
from fastapi import FastAPI
from app.routes.producto_routes import router as producto_router
from app.routes.categoria_routes import router as categoria_router
from app.routes.variante_routes import router as variante_router

from app.database import init_db

app = FastAPI()

routes = [producto_router,categoria_router,variante_router]

for i in routes:
    app.include_router(i)

#Inicializaion de la base de datos
init_db()