import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, Form, Input, Modal, Popconfirm, message, Typography, Select, Tag, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

interface BuildingType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface FloorType {
  id: string;
  name: string;
  label: string;
  description: string;
  buildingId?: string;
  createdAt: string;
  isActive: boolean;
}

interface FloorManagementPageProps {
  darkMode: boolean;
}

const FloorManagementPage: React.FC<FloorManagementPageProps> = ({ darkMode }) => {
  const [floors, setFloors] = useState<FloorType[]>([]);
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFloor, setEditingFloor] = useState<FloorType | null>(null);
  const [form] = Form.useForm();

  // Load floors
  useEffect(() => {
    setLoading(true);
    const storedFloors = localStorage.getItem('floors');
    if (storedFloors) {
      setFloors(JSON.parse(storedFloors));
    } else {
      // Initialize with sample data
      const sampleFloors: FloorType[] = [
        {
          id: '1',
          name: '1ci mərtəbə',
          label: '1ci mərtəbə',
          description: 'Birinci mərtəbə',
          buildingId: '1',
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: '2',
          name: '2ci mərtəbə',
          label: '2ci mərtəbə',
          description: 'İkinci mərtəbə',
          buildingId: '1',
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: '3',
          name: '3cü mərtəbə',
          label: '3cü mərtəbə',
          description: 'Üçüncü mərtəbə',
          buildingId: '1',
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: '4',
          name: '4cü mərtəbə',
          label: '4cü mərtəbə',
          description: 'Dördüncü mərtəbə',
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: '5',
          name: 'Dalğa',
          label: 'Dalğa',
          description: 'Dalğa binası',
          buildingId: '2',
          createdAt: new Date().toISOString(),
          isActive: true
        },
      ];
      setFloors(sampleFloors);
      localStorage.setItem('floors', JSON.stringify(sampleFloors));
    }
    setLoading(false);
  }, []);

  // Load buildings
  useEffect(() => {
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
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Dalğa binası',
          description: 'Dalğa sahə binası',
          createdAt: new Date().toISOString()
        },
      ];
      setBuildings(sampleBuildings);
      localStorage.setItem('buildings', JSON.stringify(sampleBuildings));
    }
  }, []);

  // Save floors to localStorage
  const saveFloors = (updatedFloors: FloorType[]) => {
    localStorage.setItem('floors', JSON.stringify(updatedFloors));
    setFloors(updatedFloors);
  };

  // Add or update floor
  const handleSaveFloor = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingFloor) {
        // Update existing floor
        const updatedFloors = floors.map(floor => 
          floor.id === editingFloor.id 
            ? { 
                ...floor, 
                name: values.name,
                label: values.name,
                description: values.description,
                buildingId: values.buildingId,
                isActive: values.isActive
              } 
            : floor
        );
        saveFloors(updatedFloors);
        message.success('Mərtəbə məlumatları yeniləndi');
      } else {
        // Add new floor
        const newFloor: FloorType = {
          id: Date.now().toString(),
          name: values.name,
          label: values.name,
          description: values.description,
          buildingId: values.buildingId,
          createdAt: new Date().toISOString(),
          isActive: true
        };
        saveFloors([...floors, newFloor]);
        message.success('Yeni mərtəbə əlavə edildi');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingFloor(null);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Delete floor
  const handleDeleteFloor = (id: string) => {
    // Check if there are tables using this floor
    const tableDefinitions = localStorage.getItem('tableDefinitions');
    if (tableDefinitions) {
      const tables = JSON.parse(tableDefinitions);
      const tablesUsingFloor = tables.filter((table: any) => table.floorId === id);
      
      if (tablesUsingFloor.length > 0) {
        message.error('Bu mərtəbə cədvəllər tərəfindən istifadə olunur və silinə bilməz.');
        return;
      }
    }
    
    const updatedFloors = floors.filter(floor => floor.id !== id);
    saveFloors(updatedFloors);
    message.success('Mərtəbə silindi');
  };

  // Toggle floor status
  const handleToggleStatus = (floorId: string, newStatus: boolean) => {
    const updatedFloors = floors.map(floor =>
      floor.id === floorId
        ? { ...floor, isActive: newStatus }
        : floor
    );
    saveFloors(updatedFloors);
    message.success(`Mərtəbə ${newStatus ? 'aktivləşdirildi' : 'deaktiv edildi'}`);
  };

  // Edit floor
  const handleEditFloor = (record: FloorType) => {
    setEditingFloor(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      buildingId: record.buildingId || undefined,
      isActive: record.isActive
    });
    setIsModalVisible(true);
  };

  // Add new floor
  const handleAddFloor = () => {
    setEditingFloor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Get building name by ID
  const getBuildingName = (buildingId?: string) => {
    if (!buildingId) return '-';
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.name : '-';
  };

  const columns: ColumnsType<FloorType> = [
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
      title: 'Bina',
      key: 'building',
      width: 150,
      render: (_, record) => (
        record.buildingId ? 
          <Tag color="blue">{getBuildingName(record.buildingId)}</Tag> : 
          <Tag color="default">Təyin edilməyib</Tag>
      ),
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
            onClick={() => handleEditFloor(record)}
          />
          <Popconfirm
            title="Bu mərtəbəni silmək istədiyinizə əminsiniz?"
            description="Bu əməliyyat geri qaytarıla bilməz"
            onConfirm={() => handleDeleteFloor(record.id)}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height:40,marginBottom:10 }}>
        <h2 >Mərtəbələrin İdarə Edilməsi</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddFloor}
        >
          Yeni Mərtəbə
        </Button>
      </div>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={floors} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ y: 300 , x:"max-content"}}
          
        />
      </Card>
      
      <Modal
        title={editingFloor ? "Mərtəbəni Düzəlt" : "Yeni Mərtəbə Əlavə Et"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSaveFloor}
        okText={editingFloor ? "Yenilə" : "Əlavə et"}
        cancelText="Ləğv et"
      >
        <Form
          form={form}
          layout="vertical"
          name="floor_form"
        >
          <Form.Item
            name="name"
            label="Ad"
            rules={[{ required: true, message: 'Adı daxil edin!' }]}
          >
            <Input placeholder="məsələn: 1ci mərtəbə" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Təsvir"
            rules={[{ required: true, message: 'Təsviri daxil edin!' }]}
          >
            <Input.TextArea rows={3} placeholder="Mərtəbə haqqında qısa məlumat" />
          </Form.Item>
          
          <Form.Item
            name="buildingId"
            label="Bina"
            rules={[{ required: true, message: 'Bina seçin!' }]}
          >
            <Select placeholder="Bina seçin">
              {buildings.map(building => (
                <Option key={building.id} value={building.id}>{building.name}</Option>
              ))}
            </Select>
          </Form.Item>

          {editingFloor && (
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

export default FloorManagementPage; 