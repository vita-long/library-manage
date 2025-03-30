import React, { useState } from 'react';
import { Button } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { DOMAIN_URL } from '@/commons/constants';
// import { useSse } from '@/components/SseContext';
import { Book } from '@/types/books';
import httpRequest from '@/utils/http-request';

export const Favorite: React.FC<{ book: Pick<Book, 'bookCode' | 'bookName'> & { isFavorite?: boolean } }> = ({ book }) => {
  const [isFavorite, setIsFavorite] = useState(book.isFavorite);

  const toggleFavorite = async () => {
    const response = await httpRequest.post(`${DOMAIN_URL}/books/toggle-favorite/${book.bookCode}`);
    setIsFavorite(!!response);
  };

  return (
    <Button 
      type={isFavorite ? 'primary' : 'default'}
      icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
      shape="circle"
      onClick={toggleFavorite}
    />
  );
};