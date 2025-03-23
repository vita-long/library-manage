import { DOMAIN_URL } from '@/commons/constants';
import { http } from '@/utils/http';
import * as React from 'react';

const Books = () => {

  const fetchBooks = async () => {
    try {
      return await http(`${DOMAIN_URL}/books?current=1&pageSize=10`, {
        method: 'GET'
      });
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>书籍管理</div>
  );
};

export default Books;