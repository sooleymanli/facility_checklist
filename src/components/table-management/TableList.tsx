import React from 'react';
import { Table, Button, Space, Switch, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { TableDefinitionType, BuildingType, FloorType } from '../../types/tableManagement';

interface TableListProps {
  tableDefinitions: TableDefinitionType[];
  loading: boolean;
  buildings: BuildingType[];
  floors: FloorType[];
  onEdit: (record: TableDefinitionType) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: boolean) => void;
}

const TableList: React.FC<TableListProps> = ({
  tableDefinitions,
  loading,
  buildings,
  floors,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const getBuildingName = (buildingId?: string) => {
    if (!buildingId) return '-';
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.name : '-';
  };

  const getFloorName = (floorId?: string) => {
    if (!floorId) return '-';
    const floor = floors.find(f => f.id === floorId);
    return floor ? floor.name : '-';
  };

  const columns = [
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
      render: (_: any, record: TableDefinitionType) => (
        record.buildingId ? 
          <Tag color="blue">{getBuildingName(record.buildingId)}</Tag> : 
          '-'
      ),
    },
    {
      title: 'Mərtəbə',
      key: 'floor',
      width: 150,
      render: (_: any, record: TableDefinitionType) => (
        record.floorId ? 
          <Tag color="green">{getFloorName(record.floorId)}</Tag> : 
          '-'
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean, record: TableDefinitionType) => (
        <Switch
          checked={isActive}
          onChange={(checked) => onToggleStatus(record.id, checked)}
          checkedChildren="Aktiv"
          unCheckedChildren="Deaktiv"
        />
      ),
    },
    {
      title: 'Yaradılma Tarixi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      width: 150,
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      width: 150,
      render: (_: any, record: TableDefinitionType) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            type="text" 
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Bu cədvəli silmək istədiyinizə əminsiniz?"
            description="Bu əməliyyat geri qaytarıla bilməz"
            onConfirm={() => onDelete(record.id)}
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
    <Table 
      columns={columns} 
      dataSource={tableDefinitions} 
      rowKey="id" 
      loading={loading}
      pagination={{ pageSize: 10 }}
      locale={{ emptyText: 'Cədvəl yoxdur' }}
    />
  );
};

export default TableList; 