import api from "../lib/axios";

export const getProducts = async ({
  limit = 10,
  skip = 0,
  sortBy = "",
  sortOrder = "",
}) => {
  const response = await api.get("/products", {
    params: {
      limit,
      skip,
      ...(sortBy && { sortBy }),
      ...(sortOrder && { order: sortOrder }),
    },
  });

  return response.data;
};

export const searchProducts = async ({
  query,
  limit = 10,
  skip = 0,
  sortBy = "",
  sortOrder = "",
}) => {
  const response = await api.get("/products/search", {
    params: {
      q: query,
      limit,
      skip,
      ...(sortBy && { sortBy }),
      ...(sortOrder && { order: sortOrder }),
    
    },
  });

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/products/categories");

  return response.data;
};

export const getProductsByCategory = async ({
  category,
  limit = 10,
  skip = 0,
  sortBy = "",
  sortOrder = "",
}) => {
  const response = await api.get(`/products/category/${category}`, {
    params: {
      limit,
      skip,
      ...(sortBy && { sortBy }),
      ...(sortOrder && { order: sortOrder }),
    },
  });

  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("/products/add", productData);

  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};