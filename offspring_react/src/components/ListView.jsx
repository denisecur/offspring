import React, { useState } from 'react'
import { useEffect } from 'react';
import { API } from '../constant';
import { message } from 'antd';

const ListView = () => {
    const [items, setItems] = useState([]);
    const fetchUsers = async () => {
        try {
          const response = await fetch(`${API}/users`);
          const data = await response.json();
          setItems(data ?? []);
        } catch (error) {
          console.error(error);
          message.error("Error while fetching profiles!");
        } finally {
            console.info("Done fetching users");
        }
      };
      useEffect(() => {
        fetchUsers();
      }, []);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
        
      ))}
    </div>
  )
}

export default ListView
