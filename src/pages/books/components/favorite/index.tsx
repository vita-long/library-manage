import React, { useState } from 'react';
import { Button } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { DOMAIN_URL } from '@/commons/constants';
// import { useSse } from '@/components/SseContext';
import { Book } from '@/types/books';
import { http } from '@/utils/http';

export const Favorite: React.FC<{ book: Pick<Book, 'bookCode' | 'bookName'> & { isFavorite?: boolean } }> = ({ book }) => {
  const [isFavorite, setIsFavorite] = useState(book.isFavorite);

  const toggleFavorite = async () => {
    const response = await http(`${DOMAIN_URL}/books/toggle-favorite/${book.bookCode}`, {
      method: 'POST'
    });
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