import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popover, Input, Select, Switch, message } from 'antd';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableHeader from '../components/SortableHeader';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

interface ColumnType {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  fixed?: 'left' | 'right';
  render?: (text: any, record: any) => React.ReactNode;
}

interface ColumnSettings {
  [key: string]: {
    width?: number;
    fixed?: 'left' | 'right';
  };
}

const TableManagementPage: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnSettings, setColumnSettings] = useState<ColumnSettings>({});
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddVisualColumn = () => {
    const newColumn: ColumnType = {
      key: `column-${columns.length + 1}`,
      title: `Column ${columns.length + 1}`,
      dataIndex: `column${columns.length + 1}`,
    };
    setColumns([...columns, newColumn]);
  };

  const handleColumnVisibilityChange = (columnKey: string, visible: boolean) => {
    if (visible) {
      setSelectedColumns([...selectedColumns, columnKey]);
    } else {
      setSelectedColumns(selectedColumns.filter(key => key !== columnKey));
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.key === active.id);
        const newIndex = items.findIndex((item) => item.key === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderColumns = () => {
    return columns.map((column) => ({
      ...column,
      title: (
        <SortableHeader id={column.key}>
          {column.title}
        </SortableHeader>
      ),
    }));
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddVisualColumn}>
          {t('Add Column')}
        </Button>
        <Popover
          content={
            <div style={{ width: 300 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {columns.map((column) => (
                  <div key={column.key}>
                    <Switch
                      checked={selectedColumns.includes(column.key)}
                      onChange={(checked) => handleColumnVisibilityChange(column.key, checked)}
                    />
                    <span style={{ marginLeft: 8 }}>{column.title}</span>
                  </div>
                ))}
              </Space>
            </div>
          }
          title={t('Column Settings')}
          trigger="click"
        >
          <Button>{t('Column Settings')}</Button>
        </Popover>
      </Space>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columns.map((col) => col.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            columns={renderColumns()}
            dataSource={data}
            loading={loading}
            rowKey="id"
          />
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TableManagementPage; 