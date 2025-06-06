import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { getToken } from '../helpers';

const orderApi = 'http://localhost:1337/api/orders';

interface ProductAttributes {
  name: string;
  product_code: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Product {
  id: number;
  attributes: ProductAttributes;
}

interface OrderAttributes {
  confirmed: boolean;
  confirmation_date: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  products: {
    data: Product[];
  };
}

interface Order {
  id: number;
  attributes: OrderAttributes;
}

function Orders() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['order'],
    queryFn: async () => {
      const token = getToken();
      const response = await axios.get(orderApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          populate: 'products',
        },
      });
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Orders;
