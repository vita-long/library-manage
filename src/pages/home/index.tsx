import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incremented, decremented } from '@/store/counter';
import { Button } from 'antd';

const Home = () => {
  const { value } = useSelector((state: any) => state.counter);
  const dispath = useDispatch();
  return (
    <div>
      首页
      {value}
      <Button onClick={() => dispath(incremented(10))}>+10</Button>
      <Button onClick={() => dispath(decremented(10))}>-10</Button>
    </div>
  );
};

export default Home;