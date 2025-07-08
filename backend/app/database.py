from sqlmodel import create_engine, SQLModel

url_conection = 'mysql+pymysql://root@localhost:3306/proy_lenguaje'
engine = create_engine(url_conection)

def init_db():
    SQLModel.metadata.create_all(bind=engine)