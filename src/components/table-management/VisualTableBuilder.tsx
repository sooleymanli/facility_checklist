import React from 'react';
import { Table, Button, Space, Input, Popover, Tooltip, Radio, Select } from 'antd';
import { SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableHeader from '../SortableHeader';
import { VisualColumnType } from '../../types/tableManagement';

interface VisualTableBuilderProps {
  visualColumns: VisualColumnType[];
  visualRows: Record<string, any>[];
  currentColumnIndex: number | null;
  columnSettingsContent: React.ReactNode;
  onColumnSettingsOpen: (index: number) => void;
  onColumnSettingsClose: () => void;
  onColumnRemove: (index: number) => void;
  onColumnTitleChange: (index: number, value: string) => void;
  onRowValueChange: (rowIndex: number, columnKey: string, value: any) => void;
  onColumnDragEnd: (event: DragEndEvent) => void;
}

const VisualTableBuilder: React.FC<VisualTableBuilderProps> = ({
  visualColumns,
  visualRows,
  currentColumnIndex,
  columnSettingsContent,
  onColumnSettingsOpen,
  onColumnSettingsClose,
  onColumnRemove,
  onColumnTitleChange,
  onRowValueChange,
  onColumnDragEnd
}) => {
  const calculateFormula = (formula: string, row: any) => {
    try {
      const columnNames = visualColumns.map(col => col.title);
      let calculatedFormula = formula;
      
      columnNames.forEach((name, index) => {
        const regex = new RegExp(name, 'g');
        const value = row[visualColumns[index].dataIndex] || 0;
        calculatedFormula = calculatedFormula.replace(regex, value);
      });
      
      return eval(calculatedFormula);
    } catch (error) {
      console.error('Formula calculation error:', error);
      return 'Error';
    }
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'rowIndex',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {index + 1}
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onColumnRemove(index)}
            size="small"
          />
        </div>
      )
    },
    ...visualColumns.map((column, index) => ({
      title: (
        <SortableHeader id={column.dataIndex}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
            minWidth: '150px'
          }}>
            <Input
              value={column.title}
              onChange={(e) => onColumnTitleChange(index, e.target.value)}
              bordered={false}
              style={{ 
                border: 'none',
                boxShadow: 'none',
                padding: '0',
                background: 'transparent',
                width: '100%',
                fontWeight: 'bold',
                minWidth: '150px'
              }}
            />
            <Space>
              <Popover
                content={columnSettingsContent}
                title="Sütun Parametrləri"
                placement='right'
                trigger="click"
                open={currentColumnIndex === index}
                onOpenChange={(visible) => {
                  if (visible) {
                    onColumnSettingsOpen(index);
                  } else {
                    onColumnSettingsClose();
                  }
                }}
                overlayStyle={{ marginTop: '10px' }}
              >
                <Tooltip title="Sütun parametrləri">
                  <Button 
                    type="text"
                    icon={<SettingOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    size="small"
                  />
                </Tooltip>
              </Popover>
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => onColumnRemove(index)}
                size="small"
              />
            </Space>
          </div>
        </SortableHeader>
      ),
      dataIndex: column.dataIndex,
      key: column.key,
      width: 'max-content',
      align: 'left' as const,
      render: (_: any, record: Record<string, any>, rowIndex: number) => {
        if (column.dataType === 'boolean') {
          return (
            <div style={{ textAlign: 'left', display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
              <Radio.Group 
                buttonStyle="solid" 
                size="small" 
                value={record[column.dataIndex]}
                onChange={(e) => onRowValueChange(rowIndex, column.dataIndex, e.target.value)}
              >
                <Radio.Button value="true">Bəli</Radio.Button>
                <Radio.Button value="false">Xeyr</Radio.Button>
              </Radio.Group>
            </div>
          );
        } else if (column.dataType === 'number') {
          return (
            <div style={{ padding: '0', width: '100%', height: '100%', position: 'relative', textAlign: 'left' }}>
              <Input 
                type="number" 
                placeholder={column.editable ? "Yoxlama aparan şəxs tərəfindən daxil edilir" : ""}
                bordered={column.editable}
                size="middle"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  textAlign: 'left',
                  background: 'transparent',
                  border: !column.editable ? 'none' : "1px solid #d9d9d9",
                }}
                value={record[column.dataIndex] || ''}
                onChange={(e) => onRowValueChange(rowIndex, column.dataIndex, e.target.value)}
              />
            </div>
          );
        } else if (column.dataType === 'string') {
          return (
            <div style={{ padding: '0', width: '100%', height: '100%', position: 'relative', textAlign: 'left' }}>
              <Input 
                placeholder={column.editable ? "Yoxlama aparan şəxs tərəfindən daxil edilir" : ""}
                bordered={column.editable}
                size="middle"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  textAlign: 'left',
                  background: 'transparent',
                  border: !column.editable ? 'none' : "1px solid #d9d9d9",
                }}
                value={record[column.dataIndex] || ''}
                onChange={(e) => onRowValueChange(rowIndex, column.dataIndex, e.target.value)}
              />
            </div>
          );
        } else if (column.dataType === 'select') {
          return (
            <div style={{ padding: '0', width: '100%', height: '100%', textAlign: 'left' }}>
              <Select
                placeholder="Seçin"
                size="small"
                style={{ width: '100%', height: '100%', textAlign: 'left' }}
                dropdownStyle={{ textAlign: 'left' }}
                value={record[column.dataIndex]}
                onChange={(value) => onRowValueChange(rowIndex, column.dataIndex, value)}
              >
                {(column.options && column.options.length > 0 
                  ? column.options 
                  : ['Seçim 1', 'Seçim 2']).map(option => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </div>
          );
        } else if (column.dataType === 'formula') {
          return (
            <div style={{ padding: '0', width: '100%', height: '100%', textAlign: 'left' }}>
              {column.formula ? calculateFormula(column.formula, record) : 'Düstur daxil edilməyib'}
            </div>
          );
        }
        return null;
      }
    }))
  ];

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={onColumnDragEnd}
    >
      <SortableContext
        items={visualColumns.map(col => col.dataIndex)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          dataSource={visualRows}
          bordered
          columns={columns}
          pagination={false}
          size="small"
        />
      </SortableContext>
    </DndContext>
  );
};

export default VisualTableBuilder; 