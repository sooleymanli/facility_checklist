import React, { useState, useMemo } from 'react';
import { Table, Radio, Space, Button, theme } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// Room names for sample data
const roomNames = [
  'HR Otağı',
  'İT Otağı',
  'Kitabxana',
  'Mətbəx',
  'Konfrans Zalı',
  'Direktor Otağı',
  'Qonaq Otağı',
  'Arxiv',
  'Tədris Otağı',
  'Laboratoriya',
];

export interface DataType {
  key: string;
  name: string;
  [key: string]: any;
}

interface TableColumnDefinition {
  id: string;
  name: string;
  dataType: 'boolean' | 'string' | 'select' | 'custom-rows';
  options?: string[];
  customRows?: string[];
  required: boolean;
}

interface CustomTableProps {
  darkMode: boolean;
  preloadedData?: DataType[];
  tableDefinition?: {
    columns: TableColumnDefinition[];
  };
}

// Radio group component for boolean fields
const TableRadioGroup: React.FC<{
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}> = ({ value, onChange }) => {
  const handleChange = (e: RadioChangeEvent) => {
    onChange(e.target.value);
  };

  return (
    <Radio.Group 
      value={value} 
      onChange={handleChange}
      optionType="button"
      buttonStyle="solid"
      size="small"
    >
      <Radio.Button value={true}>Bəli</Radio.Button>
      <Radio.Button value={false}>Xeyr</Radio.Button>
    </Radio.Group>
  );
};

// Generate sample data for default view
const generateSampleData = (): DataType[] => {
  return roomNames.map((name, index) => ({
    key: (index + 1).toString(),
    name,
    // Initialize with null values for all fields
    light: null,
    equipment: null,
    underTable: null,
    wall: null,
    ceiling: null,
    window: null,
    door: null,
    floor: null,
    chair: null,
  }));
};

const CustomTable: React.FC<CustomTableProps> = ({ 
  darkMode, 
  preloadedData, 
  tableDefinition 
}) => {
  const { token } = theme.useToken();
  
  // Initialize with either preloaded data or sample data
  const [data, setData] = useState<DataType[]>(() => {
    if (preloadedData) {
      return preloadedData;
    }
    
    // If we have a table definition with custom rows, use them
    if (tableDefinition?.columns) {
      const customRowsColumn = tableDefinition.columns.find(col => 
        col.dataType === 'custom-rows' && col.customRows && col.customRows.length > 0
      );
      
      if (customRowsColumn?.customRows) {
        // Generate data from custom rows
        return customRowsColumn.customRows.map((rowName, index) => {
          const row: DataType = {
            key: (index + 1).toString(),
            name: rowName
          };
          
          // Initialize fields from other columns
          tableDefinition.columns
            .filter(col => col.dataType !== 'custom-rows')
            .forEach(col => {
              row[col.id] = null;
            });
            
          return row;
        });
      }
    }
    
    // Default sample data
    return generateSampleData();
  });

  // Handler for data changes
  const handleCellChange = (key: string, dataIndex: string, value: any) => {
    setData(prevData => 
      prevData.map(item => 
        item.key === key ? { ...item, [dataIndex]: value } : item
      )
    );
  };
  
  // Render cell based on data type
  const renderCellContent = (
    record: DataType, 
    dataIndex: string, 
    dataType: 'boolean' | 'string' | 'select' | 'custom-rows',
    options?: string[]
  ) => {
    if (dataType === 'boolean') {
      return (
        <TableRadioGroup 
          value={record[dataIndex]} 
          onChange={(value) => handleCellChange(record.key, dataIndex, value)}
        />
      );
    }
    
    if (dataType === 'select' && options && options.length > 0) {
      return (
        <select
          value={record[dataIndex] || ''}
          onChange={(e) => handleCellChange(record.key, dataIndex, e.target.value)}
          style={{ width: '100%', padding: '5px', borderRadius: '2px', border: '1px solid #d9d9d9' }}
        >
          <option value="">Seçin</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
    
    // custom-rows type should never be rendered as a cell since it's used for row generation
    if (dataType === 'custom-rows') {
      return null;
    }
    
    // Default: string input
    return (
      <input
        type="text"
        value={record[dataIndex] || ''}
        onChange={(e) => handleCellChange(record.key, dataIndex, e.target.value)}
        style={{ width: '100%', padding: '5px', borderRadius: '2px', border: '1px solid #d9d9d9' }}
      />
    );
  };
  
  // Generate columns based on table definition or defaults
  const columns = useMemo(() => {
    // Start with the name column
    const baseColumns: ColumnsType<DataType> = [
      {
        title: 'Otaq Adı',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 150,
      },
    ];
    
    // If we have a table definition, use it to generate columns
    if (tableDefinition?.columns) {
      const dynamicColumns = tableDefinition.columns
        .filter(col => col.dataType !== 'custom-rows') // Exclude custom-rows type as it's used for row generation
        .map(col => ({
          title: col.name,
          dataIndex: col.id,
          key: col.id,
          width: 120,
          render: (_: any, record: DataType) => 
            renderCellContent(record, col.id, col.dataType, col.options),
        }));
      
      return [...baseColumns, ...dynamicColumns];
    }
    
    // Default columns if no table definition is provided
    return [
      ...baseColumns,
      {
        title: 'Işıq',
        dataIndex: 'light',
        key: 'light',
        width: 120,
        render: (_: any, record: DataType) => 
          renderCellContent(record, 'light', 'boolean'),
      },
      {
        title: 'Avadanlıq',
        dataIndex: 'equipment',
        key: 'equipment',
        width: 120,
        render: (_: any, record: DataType) => 
          renderCellContent(record, 'equipment', 'boolean'),
      },
      {
        title: 'Masa altı',
        dataIndex: 'underTable',
        key: 'underTable',
        width: 120,
        render: (_: any, record: DataType) => 
          renderCellContent(record, 'underTable', 'boolean'),
      },
      {
        title: 'Divar',
        dataIndex: 'wall',
        key: 'wall',
        width: 120,
        render: (_: any, record: DataType) => 
          renderCellContent(record, 'wall', 'boolean'),
      },
      {
        title: 'Tavan',
        dataIndex: 'ceiling',
        key: 'ceiling',
        width: 120,
        render: (_: any, record: DataType) => 
          renderCellContent(record, 'ceiling', 'boolean'),
      },
      {
        title: 'Pəncərə',
        dataIndex: 'window',
        key: 'window',
        width: 120,
        render: (_: any, record: DataType) => 
          renderCellContent(record, 'window', 'boolean'),
      },
      {
        title: 'Qapı',
        dataIndex: 'door',
        key: 'door',
        width: 120,
        render: (_: any, record: DataType) => 
          renderCellContent(record, 'door', 'boolean'),
      },
      {
        title: 'Döşəmə',
        dataIndex: 'floor',
        key: 'floor',
        width: 120,
        render: (_: any, record: DataType) => 
          renderCellContent(record, 'floor', 'boolean'),
      },
      {
        title: 'Kreslo',
        dataIndex: 'chair',
        key: 'chair',
        width: 120,
        render: (_: any, record: DataType) => 
          renderCellContent(record, 'chair', 'boolean'),
      },
    ];
  }, [tableDefinition]);
  
  // Table style based on dark mode
  const tableStyle = useMemo(() => ({
    backgroundColor: token.colorBgContainer,
    borderRadius: '8px',
    overflow: 'auto',
    marginBottom: '20px',
  }), [token.colorBgContainer]);
  


  return (
    <div style={tableStyle}>
      <Table 
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
        rowKey="key"
        size="middle"
      />
    
    </div>
  );
};

export default CustomTable;