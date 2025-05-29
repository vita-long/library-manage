import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, message, DatePicker, Form, Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import httpRequest from '@/utils/http-request';
import { Book } from '@/types/books';
import { DOMAIN_URL } from '@/commons/constants';
import dayjs, { Dayjs } from 'dayjs';

const BookDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowVisible, setBorrowVisible] = useState(false);
  const [borrowForm] = Form.useForm();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const bookData = await httpRequest.get<null, Book>(`${DOMAIN_URL}/books/${id}`);
        setBook(bookData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        message.error('获取图书详情失败');
        navigate('/dashboard/books');
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleBorrowSubmit = async (values: { endDate: Dayjs }) => {
    console.log(values);
    try {
      await httpRequest.post(`${DOMAIN_URL}/books/borrow`, {
        id: book?.id,
        endDate: values.endDate.format('YYYY-MM-DD')
      });
      message.success('借书成功');
      setBorrowVisible(false);
    } catch (err) {
      console.log(err);
      message.error('借书失败');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={() => navigate('/dashboard/books')}
          className="mb-4"
        >
          返回图书列表
        </Button>

        <Spin spinning={loading}>
          {book && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <img 
                  src={book.cover} 
                  alt={book.bookName} 
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              
              <div className="w-full md:w-2/3">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{book.bookName}</h1>
                <p className="text-gray-600 mb-2">作者: {book.author}</p>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">图书简介</h2>
                  <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
                </div>
                {
                  book.isBorrow ? '已借阅' : (
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={() => setBorrowVisible(true)}
                    >
                      借阅此书
                    </Button>
                  )
                }
                
              </div>
            </div>
          )}
        </Spin>

        <Modal
          title={`借阅【${book?.bookName}】`}
          open={borrowVisible}
          onCancel={() => setBorrowVisible(false)}
          onOk={() => borrowForm.submit()}
        >
          <Form
            form={borrowForm}
            layout="vertical"
            onFinish={handleBorrowSubmit}
          >
            <Form.Item
              label="结束日期"
              name="endDate"
              rules={[{ 
                required: true, 
                message: '请选择结束日期'
              }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                disabledDate={(current) => {
                  // 替换原有的moment代码
                  const today = dayjs().startOf('day');
                  const maxDate = dayjs().add(1, 'month').endOf('day');
                  return current && (current < today || current > maxDate);
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default BookDetail;