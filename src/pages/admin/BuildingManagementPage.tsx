import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, Form, Input, Modal, Popconfirm, message, Typography, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface BuildingType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  isActive: boolean;
}

interface BuildingManagementPageProps {
  darkMode: boolean;
}

const BuildingManagementPage: React.FC<BuildingManagementPageProps> = ({ darkMode }) => {
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<BuildingType | null>(null);
  const [form] = Form.useForm();

  // Load buildings
  useEffect(() => {
    setLoading(true);
    const storedBuildings = localStorage.getItem('buildings');
    if (storedBuildings) {
      setBuildings(JSON.parse(storedBuildings));
    } else {
      // Initialize with sample data
      const sampleBuildings: BuildingType[] = [
        {
          id: '1',
          name: 'Əsas bina',
          description: 'Mərkəzi ofis binası',
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: '2',
          name: 'Dalğa binası',
          description: 'Dalğa sahə binası',
          createdAt: new Date().toISOString(),
          isActive: true
        },
      ];
      setBuildings(sampleBuildings);
      localStorage.setItem('buildings', JSON.stringify(sampleBuildings));
    }
    setLoading(false);
  }, []);

  // Save buildings to localStorage
  const saveBuildings = (updatedBuildings: BuildingType[]) => {
    localStorage.setItem('buildings', JSON.stringify(updatedBuildings));
    setBuildings(updatedBuildings);
  };

  // Add or update building
  const handleSaveBuilding = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingBuilding) {
        // Update existing building
        const updatedBuildings = buildings.map(building => 
          building.id === editingBuilding.id 
            ? { 
                ...building, 
                name: values.name,
                description: values.description,
                isActive: values.isActive
              } 
            : building
        );
        saveBuildings(updatedBuildings);
        message.success('Bina məlumatları yeniləndi');
      } else {
        // Add new building
        const newBuilding: BuildingType = {
          id: Date.now().toString(),
          name: values.name,
          description: values.description,
          createdAt: new Date().toISOString(),
          isActive: true // Default to active for new buildings
        };
        saveBuildings([...buildings, newBuilding]);
        message.success('Yeni bina əlavə edildi');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingBuilding(null);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Toggle building status
  const handleToggleStatus = (buildingId: string, newStatus: boolean) => {
    const updatedBuildings = buildings.map(building =>
      building.id === buildingId
        ? { ...building, isActive: newStatus }
        : building
    );
    saveBuildings(updatedBuildings);
    message.success(`Bina ${newStatus ? 'aktivləşdirildi' : 'deaktiv edildi'}`);
  };

  // Delete building
  const handleDeleteBuilding = (id: string) => {
    // Check if there are floors using this building
    const storedFloors = localStorage.getItem('floors');
    if (storedFloors) {
      const floors = JSON.parse(storedFloors);
      const floorsUsingBuilding = floors.filter((floor: any) => floor.buildingId === id);
      
      if (floorsUsingBuilding.length > 0) {
        message.error('Bu bina mərtəbələr tərəfindən istifadə olunur və silinə bilməz.');
        return;
      }
    }
    
    // Check if there are tables using this building
    const tableDefinitions = localStorage.getItem('tableDefinitions');
    if (tableDefinitions) {
      const tables = JSON.parse(tableDefinitions);
      const tablesUsingBuilding = tables.filter((table: any) => table.buildingId === id);
      
      if (tablesUsingBuilding.length > 0) {
        message.error('Bu bina cədvəllər tərəfindən istifadə olunur və silinə bilməz.');
        return;
      }
    }
    
    const updatedBuildings = buildings.filter(building => building.id !== id);
    saveBuildings(updatedBuildings);
    message.success('Bina silindi');
  };

  // Edit building
  const handleEditBuilding = (record: BuildingType) => {
    setEditingBuilding(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      isActive: record.isActive
    });
    setIsModalVisible(true);
  };

  // Add new building
  const handleAddBuilding = () => {
    setEditingBuilding(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const columns: ColumnsType<BuildingType> = [
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
      title: 'Yaradılma Tarixi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          checkedChildren="Aktiv"
          unCheckedChildren="Deaktiv"
        />
      ),
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
            onClick={() => handleEditBuilding(record)}
          />
          <Popconfirm
            title="Bu binanı silmək istədiyinizə əminsiniz?"
            description="Bu əməliyyat geri qaytarıla bilməz"
            onConfirm={() => handleDeleteBuilding(record.id)}
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
        <Title level={4}>Binaların İdarə Edilməsi</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddBuilding}
        >
          Yeni Bina
        </Button>
      </div>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={buildings} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Modal
        title={editingBuilding ? "Binanı Düzəlt" : "Yeni Bina Əlavə Et"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSaveBuilding}
        okText={editingBuilding ? "Yenilə" : "Əlavə et"}
        cancelText="Ləğv et"
      >
        <Form
          form={form}
          layout="vertical"
          name="building_form"
        >
          <Form.Item
            name="name"
            label="Ad"
            rules={[{ required: true, message: 'Binanın adını daxil edin!' }]}
          >
            <Input placeholder="məsələn: Əsas bina" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Təsvir"
            rules={[{ required: true, message: 'Təsviri daxil edin!' }]}
          >
            <Input.TextArea rows={3} placeholder="Bina haqqında qısa məlumat" />
          </Form.Item>

          {editingBuilding && (
            <Form.Item
              name="isActive"
              label="Status"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch
                checkedChildren="Aktiv"
                unCheckedChildren="Deaktiv"
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default BuildingManagementPage; 