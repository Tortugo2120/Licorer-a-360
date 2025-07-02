class producto:
    def __init__(self, id_producto, nombre, precio, stock):
        self.id_producto = id_producto
        self.nombre = nombre
        self.precio = precio
        self.stock = stock

    def __str__(self):
        return f"Producto(id_producto={self.id_producto}, nombre='{self.nombre}', precio={self.precio}, stock={self.stock})"
    
    def set_id_producto(self, id_producto):
        self.id_producto = id_producto

    def get_id_producto(self):
        return self.id_producto
    
    def set_nombre(self, nombre):
        self.nombre = nombre

    def get_nombre(self):
        return self.nombre
    
    def set_precio(self, precio):
        self.precio = precio

    def get_precio(self):
        return self.precio
    
    def set_stock(self, stock):
        self.stock = stock

    def get_stock(self):
        return self.stock