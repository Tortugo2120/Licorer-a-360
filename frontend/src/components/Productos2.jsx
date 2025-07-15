import React, { useState,useEffect } from "react";
import axios from "axios";

const Productos2 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/productos"
        );
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data.map((product) => (
          <div>
            <li key={product.id}>
              <h2>{product.nombre}</h2>
              <p>Descripción: {product.descripcion}</p>
              <p>Categoría: {product.categoria.nombre}</p>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Productos2;
