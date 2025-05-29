import React, { useState, useEffect } from 'react';
import {
  List,
  Pagination,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  message,
  Tooltip
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { DOMAIN_URL } from '@/commons/constants';
import { Book } from '@/types/books';
import { Favorite } from './components/favorite';
import httpRequest from '@/utils/http-request';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';


const BookList: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  const fetchBooks = async (page: number) => {
    try{
      setLoading(true);
      const bookList = await httpRequest.get<{current: number, pageSize: number}, { list: Book[], total: number }>(`${DOMAIN_URL}/books`,{
        current: page,
        pageSize
      });
      setBooks(bookList.list);
      setTotal(bookList.total);
      setLoading(false);
    } catch(error: any) {
      console.log(error);
    }
  };

  // 删除单本书籍
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这本图书吗？',
      onOk: async () => {
        await httpRequest.delete(`${DOMAIN_URL}/books?id=${id}`);
        message.success('删除成功');
        fetchBooks(1);
      }
    });
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      message.warning('请选择要删除的图书');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedIds.length} 本图书吗？`,
      onOk: () => {
        httpRequest.delete(`${DOMAIN_URL}/books`, {
          ids: selectedIds
        });
        fetchBooks(1);
        setSelectedIds([]);
        message.success('批量删除成功');
      }
    });
  };

  // 提交表单（新增/更新）
  const handleSubmit = async (values: Omit<Book, 'id'>) => {
    try {
      if (currentBook) {
        await httpRequest.put(`${DOMAIN_URL}/books/${currentBook.id}`, {
          bookName: values.bookName,
          author: values.author,
          cover: values.cover,
          description: values.description
        });
        fetchBooks(1);
        message.success('更新成功');
      } else {
        // 新增操作
        const newBook = await httpRequest.post<any, Book>(`${DOMAIN_URL}/books`, {
          bookName: values.bookName,
          author: values.author,
          cover: values.cover,
          description: values.description
        });
        setBooks([newBook, ...books]);
        message.success('新增成功');
      }
      setModalVisible(false);
    } catch (err) {
      console.log(err);
    }
  };

  // 打开编辑模态框
  const openEditModal = (book: Book) => {
    setCurrentBook(book);
    form.setFieldsValue(book);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">图书管理</h1>
          <div className="space-x-4">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setCurrentBook(null);
                form.resetFields();
                setModalVisible(true);
              }}
            >
              新增图书
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>
          </div>
        </div>

        <Spin spinning={loading}>
          <List
            grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={books}
            renderItem={item => (
              <List.Item className="group relative w-[192px]">
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onChange={e => {
                      setSelectedIds(
                        e.target.checked
                          ? [...selectedIds, item.id]
                          : selectedIds.filter(id => id !== item.id)
                      );
                    }}
                  />
                </div>
                
                <div className="w-full h-full border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-64 bg-gray-100">
                    <img
                      alt={item.bookName}
                      src={item.cover}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* 在列表项按钮组中添加详情按钮 */}
                    <div className="absolute top-2 left-2 space-x-2">
                      <Button
                        icon={<EditOutlined />}
                        shape="circle"
                        onClick={() => openEditModal(item)}
                      />
                      <Button
                        icon={<EyeOutlined />}
                        shape="circle"
                        onClick={() => navigate(`/dashboard/books/${item.id}`)}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        shape="circle"
                        onClick={() => handleDelete(item.id)}
                      />
                      <Favorite book={{ bookCode: item.bookCode, bookName: item.bookName, isFavorite: item.isFavorite }} />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      <Tooltip 
                        title={item.bookName} 
                        placement="top" 
                        mouseEnterDelay={0.3}
                      >
                        <span className="book-title">{item.bookName}</span>
                      </Tooltip>
                    </h3>
                    <p className="text-sm text-gray-600">{item.author}</p>
                  </div>
                </div>
              </List.Item>
            )}
          />

          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </Spin>

        {/* 新增/编辑模态框 */}
        <Modal
          title={currentBook ? "编辑图书" : "新增图书"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ year: 2023 }}
          >
            <Form.Item
              label="书名"
              name="bookName"
              rules={[{ required: true, message: '请输入书名' }]}
            >
              <Input placeholder="请输入书名" />
            </Form.Item>

            <Form.Item
              label="作者"
              name="author"
              rules={[{ required: true, message: '请输入作者' }]}
            >
              <Input placeholder="请输入作者" />
            </Form.Item>

            <Form.Item
              label="封面URL"
              name="cover"
              rules={[{ required: true, message: '请输入封面URL' }]}
            >
              <Input placeholder="请输入图片地址" />
            </Form.Item>

            <Form.Item
              label="描述"
              name="description"
              rules={[{ required: true, message: '请输入描述' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <div className="flex justify-end space-x-4">
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default BookList;