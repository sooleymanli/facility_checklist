import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, Form, Input, Modal, Popconfirm, message, Typography, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

interface FloorType {
  id: string;
  key: string;
  name: string;
  label: string;
}

interface CategoryType {
  id: string;
  key: string;
  name: string;
  description: string;
  floors: string[]; // Array of floor IDs
  createdAt: string;
}

interface CategoryManagementPageProps {
  darkMode: boolean;
}

const CategoryManagementPage: React.FC<CategoryManagementPageProps> = ({ darkMode }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [floors, setFloors] = useState<FloorType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [form] = Form.useForm();

  // Load floors
  useEffect(() => {
    const storedFloors = localStorage.getItem('floors');
    if (storedFloors) {
      setFloors(JSON.parse(storedFloors));
    } else {
      setFloors([]);
    }
  }, []);

  // Load categories
  useEffect(() => {
    setLoading(true);
    // In a real app, this would be an API call
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Initial sample data
      const sampleCategories = [
        { 
          id: '1', 
          key: 'rooms', 
          name: 'Otaqlar', 
          description: 'Bütün otaqlar üçün yoxlama siyahısı', 
          floors: ['1', '2', '3', '4', '5'], 
          createdAt: new Date().toISOString() 
        },
        { 
          id: '2', 
          key: 'cleaning', 
          name: 'Təmizlik', 
          description: 'Təmizlik yoxlama siyahısı', 
          floors: ['1', '2', '3', '4'], 
          createdAt: new Date().toISOString() 
        },
        { 
          id: '3', 
          key: 'vehicles', 
          name: 'Maşınlar', 
          description: 'Maşınlar üçün yoxlama', 
          floors: ['5'], 
          createdAt: new Date().toISOString() 
        },
        { 
          id: '4', 
          key: 'temperature', 
          name: 'Temperator', 
          description: 'Temperator yoxlama siyahısı', 
          floors: ['1', '2', '3', '4'], 
          createdAt: new Date().toISOString() 
        },
      ];
      setCategories(sampleCategories);
      localStorage.setItem('categories', JSON.stringify(sampleCategories));
    }
    setLoading(false);
  }, []);

  // Save categories to local storage
  const saveCategories = (updatedCategories: CategoryType[]) => {
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
  };

  // Add or update category
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCategory) {
        // Update existing category
        const updatedCategories = categories.map(category => 
          category.id === editingCategory.id 
            ? { 
                ...category, 
                key: values.key,
                name: values.name,
                description: values.description,
                floors: values.floors
              } 
            : category
        );
        saveCategories(updatedCategories);
        message.success('Kateqoriya məlumatları yeniləndi');
      } else {
        // Add new category
        const newCategory: CategoryType = {
          id: Date.now().toString(),
          key: values.key,
          name: values.name,
          description: values.description,
          floors: values.floors,
          createdAt: new Date().toISOString()
        };
        saveCategories([...categories, newCategory]);
        message.success('Yeni kateqoriya əlavə edildi');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Delete category
  const handleDelete = (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    saveCategories(updatedCategories);
    message.success('Kateqoriya silindi');
  };

  // Open edit modal
  const handleEdit = (record: CategoryType) => {
    setEditingCategory(record);
    form.setFieldsValue({
      key: record.key,
      name: record.name,
      description: record.description,
      floors: record.floors
    });
    setIsModalVisible(true);
  };

  // Open create modal
  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Get floor names from IDs
  const getFloorNames = (floorIds: string[]) => {
    return floorIds.map(id => {
      const floor = floors.find(f => f.id === id);
      return floor ? floor.name : 'Unknown';
    });
  };

  const columns: ColumnsType<CategoryType> = [
    {
      title: 'Açar',
      dataIndex: 'key',
      key: 'key',
      width: 150,
    },
    {
      title: 'Ad',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Təsvir',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Mərtəbələr',
      dataIndex: 'floors',
      key: 'floors',
      render: (floorIds: string[]) => (
        <>
          {getFloorNames(floorIds).map(floorName => (
            <Tag color="blue" key={floorName}>
              {floorName}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Yaradılma Tarixi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      width: 150,
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            type="text" 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bu kateqoriyanı silmək istədiyinizə əminsiniz?"
            description="Bu əməliyyat geri qaytarıla bilməz"
            onConfirm={() => handleDelete(record.id)}
            okText="Bəli"
            cancelText="Xeyr"
          >
            <Button 
              icon={<DeleteOutlined />} 
              type="text" 
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Kateqoriyaların İdarə Edilməsi</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
        >
          Yeni Kateqoriya
        </Button>
      </div>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={categories} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Modal
        title={editingCategory ? "Kateqoriyanı Düzəlt" : "Yeni Kateqoriya Əlavə Et"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSave}
        okText={editingCategory ? "Yenilə" : "Əlavə et"}
        cancelText="Ləğv et"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="category_form"
        >
          <Form.Item
            name="key"
            label="Açar (sistem üçün)"
            rules={[
              { required: true, message: 'Açarı daxil edin!' },
              { pattern: /^[a-z0-9-]+$/, message: 'Açar yalnız kiçik hərflər, rəqəmlər və defis işarəsi ola bilər!' }
            ]}
            tooltip="Sistemdə istifadə olunacaq unikal açar. Məsələn: 'rooms'"
          >
            <Input placeholder="məsələn: rooms" />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="Kateqoriya Adı"
            rules={[{ required: true, message: 'Kateqoriyanın adını daxil edin!' }]}
          >
            <Input placeholder="məsələn: Otaqlar" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Təsvir"
            rules={[{ required: true, message: 'Təsviri daxil edin!' }]}
          >
            <Input.TextArea rows={4} placeholder="Kateqoriya haqqında qısa məlumat" />
          </Form.Item>
          
          <Form.Item
            name="floors"
            label="Mərtəbələr"
            rules={[{ required: true, message: 'Ən azı bir mərtəbə seçin!' }]}
            tooltip="Bu kateqoriyanın mövcud olduğu mərtəbələr"
          >
            <Select
              mode="multiple"
              placeholder="Mərtəbələri seçin"
              style={{ width: '100%' }}
              optionFilterProp="children"
            >
              {floors.map(floor => (
                <Option key={floor.id} value={floor.id}>{floor.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagementPage; 