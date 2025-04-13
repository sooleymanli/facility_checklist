import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Table, Space, Form, Input, Modal, Popconfirm, message, Typography, 
  Select, Tabs, Collapse, Row, Col, Divider, List, Tag, Switch, Tooltip, Checkbox, Radio,
  Drawer, Popover
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  PlusCircleOutlined, MinusCircleOutlined, TableOutlined, EyeOutlined,
  SettingOutlined, CloseOutlined,
  InsertRowAboveOutlined,
  InsertRowLeftOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableHeader from '../../components/SortableHeader';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// Column data type options
type ColumnDataType = 'boolean' | 'string' | 'select' | 'custom-rows' | 'number' | 'formula';

interface BuildingType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface FloorType {
  id: string;
  key: string;
  name: string;
  label: string;
  description: string;
  buildingId?: string;
  createdAt: string;
}

interface TableColumnType {
  id: string;
  name: string;
  dataType: ColumnDataType;
  options?: string[]; // For select type columns
  customRows?: string[]; // For custom row values like room names
  required: boolean;
}

interface TableDefinitionType {
  id: string;
  name: string;
  description: string;
  buildingId?: string;
  floorId?: string;
  columns: TableColumnType[];
  createdAt: string;
  isActive: boolean;
}

interface TableManagementPageProps {
  darkMode: boolean;
}

// Add interface for visual column with configuration
interface VisualColumnType {
  title: string;
  dataIndex: string;
  key: string;
  dataType: ColumnDataType;
  editable: boolean;
  required: boolean;
  options?: string[]; // Add options for select type
  formula?: string;
}

// Helper functions
const getDataTypeLabel = (dataType: ColumnDataType): string => {
  const labels: Record<ColumnDataType, string> = {
    'boolean': 'Bəli/Xeyr',
    'string': 'Mətn',
    'select': 'Seçim',
    'custom-rows': 'Xüsusi sətrlər',
    'number': 'Rəqəm',
    'formula': 'Düstur'
  };
  return labels[dataType];
};

const getTagColorByDataType = (dataType: ColumnDataType): string => {
  const colors: Record<ColumnDataType, string> = {
    'boolean': 'green',
    'string': 'blue',
    'select': 'purple',
    'custom-rows': 'orange',
    'number': 'cyan',
    'formula': 'magenta'
  };
  return colors[dataType];
};

// Visual Table Builder interfaces
interface VisualTableBuilderProps {
  onSave: (columns: TableColumnType[]) => void;
  onCancel: () => void;
  initialColumns?: TableColumnType[];
}

const VisualTableBuilder: React.FC<VisualTableBuilderProps> = ({
  onSave,
  onCancel,
  initialColumns = []
}) => {
  const [columns, setColumns] = useState<TableColumnType[]>(initialColumns);
  const [previewData, setPreviewData] = useState<any[]>([{}, {}, {}]); // Sample rows for preview
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);

  const handleAddColumn = () => {
    const newColumn: TableColumnType = {
      id: Date.now().toString(),
      name: `Yeni sütun ${columns.length + 1}`,
      dataType: 'boolean',
      required: false
    };
    setColumns([...columns, newColumn]);
  };

  const handleEditColumn = (column: TableColumnType) => {
    setEditingColumnId(column.id);
  };

  const handleColumnUpdate = (columnId: string, updates: Partial<TableColumnType>) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    ));
    setEditingColumnId(null);
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const handleSave = () => {
    if (columns.length === 0) {
      message.error('Ən azı bir sütun əlavə edilməlidir');
      return;
    }
    onSave(columns);
  };

  return (
    <Card title="Cədvəl Formalaşdır" style={{ width: '100%' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddColumn}>
          Yeni Sütun
        </Button>

        <Table
          dataSource={columns}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Sütun adı',
              dataIndex: 'name',
              render: (text, record) => (
                editingColumnId === record.id ? (
                  <Input
                    defaultValue={text}
                    onPressEnter={(e) => handleColumnUpdate(record.id, { name: e.currentTarget.value })}
                  />
                ) : (
                  <Space>
                    {text}
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEditColumn(record)} />
                  </Space>
                )
              )
            },
            {
              title: 'Məlumat növü',
              dataIndex: 'dataType',
              render: (text, record) => (
                editingColumnId === record.id ? (
                  <Select
                    defaultValue={text}
                    style={{ width: 120 }}
                    onChange={(value) => handleColumnUpdate(record.id, { dataType: value as ColumnDataType })}
                  >
                    <Option value="boolean">Bəli/Xeyr</Option>
                    <Option value="string">Mətn</Option>
                    <Option value="select">Seçim</Option>
                    <Option value="number">Rəqəm</Option>
                    <Option value="custom-rows">Xüsusi sətrlər</Option>
                    <Option value="formula">Düstur</Option>
                  </Select>
                ) : (
                  <Tag color={getTagColorByDataType(text as ColumnDataType)}>
                    {getDataTypeLabel(text as ColumnDataType)}
                  </Tag>
                )
              )
            },
            {
              title: 'Məcburi',
              dataIndex: 'required',
              render: (checked, record) => (
                <Switch
                  checked={checked}
                  onChange={(checked) => handleColumnUpdate(record.id, { required: checked })}
                />
              )
            },
            {
              title: 'Əməliyyatlar',
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <Tooltip title="Sil">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteColumn(record.id)}
                    />
                  </Tooltip>
                </Space>
              )
            }
          ]}
        />

        <Divider />

        <Space>
          <Button type="primary" onClick={handleSave}>
            Yadda saxla
          </Button>
          <Button onClick={onCancel}>
            Ləğv et
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

const TableManagementPage: React.FC<TableManagementPageProps> = ({ darkMode }) => {
  const [tableDefinitions, setTableDefinitions] = useState<TableDefinitionType[]>([]);
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [floors, setFloors] = useState<FloorType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState<TableDefinitionType | null>(null);
  const [form] = Form.useForm();
  const [columnsForm] = Form.useForm();

  // Column modal state
  const [columnModalVisible, setColumnModalVisible] = useState(false);
  const [editingColumn, setEditingColumn] = useState<TableColumnType | null>(null);
  const [columnsList, setColumnsList] = useState<TableColumnType[]>([]);

  // Visual table builder state
  const [visualBuilderVisible, setVisualBuilderVisible] = useState(false);
  const [visualColumns, setVisualColumns] = useState<VisualColumnType[]>([
    {title: 'Başlıq 1', dataIndex: 'col1', key: 'col1', dataType: 'string', editable: false, required: true},
    {title: 'Başlıq 2', dataIndex: 'col2', key: 'col2', dataType: 'string', editable: false, required: true},
    {title: 'Başlıq 3', dataIndex: 'col3', key: 'col3', dataType: 'string', editable: false, required: true},
  ]);
  const [visualRows, setVisualRows] = useState<Record<string, any>[]>([
    {key: '1', col1: '', col2: '', col3: ''},
    {key: '2', col1: '', col2: '', col3: ''},
    {key: '3', col1: '', col2: '', col3: ''},
  ]);
  const [editingHeader, setEditingHeader] = useState<{index: number, value: string} | null>(null);
  
  // Column settings Popover
  const [columnSettingsForm] = Form.useForm();
  const [currentColumnIndex, setCurrentColumnIndex] = useState<number | null>(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<ColumnDataType>('string');
  const [optionInput, setOptionInput] = useState('');

  // Column order
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);

  // Load buildings
  useEffect(() => {
    const storedBuildings = localStorage.getItem('buildings');
    if (storedBuildings) {
      setBuildings(JSON.parse(storedBuildings));
    } else {
      setBuildings([]);
    }
  }, []);

  // Load floors
  useEffect(() => {
    const storedFloors = localStorage.getItem('floors');
    if (storedFloors) {
      setFloors(JSON.parse(storedFloors));
    } else {
      setFloors([]);
    }
  }, []);

  // Load table definitions
  useEffect(() => {
    setLoading(true);
    const storedTables = localStorage.getItem('tableDefinitions');
    if (storedTables) {
      setTableDefinitions(JSON.parse(storedTables));
    } else {
      // Sample data
      const sampleTables: TableDefinitionType[] = [
        {
          id: '1',
          name: 'Ofis Otağı Yoxlaması',
          description: 'Ofis otaqları üçün yoxlama cədvəli',
          floorId: '1', // 1ci mərtəbə
          columns: [
            { id: '1', name: 'Işıq', dataType: 'boolean', required: true },
            { id: '2', name: 'Avadanlıq', dataType: 'boolean', required: true },
            { id: '3', name: 'Masa altı', dataType: 'boolean', required: true },
            { id: '4', name: 'Divar', dataType: 'boolean', required: true },
            { id: '5', name: 'Tavan', dataType: 'boolean', required: true },
            { id: '6', name: 'Pəncərə', dataType: 'boolean', required: true },
            { id: '7', name: 'Qapı', dataType: 'boolean', required: true },
            { id: '8', name: 'Döşəmə', dataType: 'boolean', required: true },
            { id: '9', name: 'Kreslo', dataType: 'boolean', required: true },
          ],
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: '2',
          name: 'Təmizlik Yoxlaması',
          description: 'Ümumi təmizlik yoxlama cədvəli',
          buildingId: '1', // Əsas bina
          columns: [
            { id: '1', name: 'Döşəmə təmizliyi', dataType: 'boolean', required: true },
            { id: '2', name: 'Toz silmə', dataType: 'boolean', required: true },
            { id: '3', name: 'Zibil qutuları', dataType: 'boolean', required: true },
            { id: '4', name: 'Təmizlik vəziyyəti', dataType: 'select', options: ['Əla', 'Yaxşı', 'Orta', 'Pis'], required: true },
            { id: '5', name: 'Qeydlər', dataType: 'string', required: false },
          ],
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: '3',
          name: 'Maşın Yoxlaması',
          description: 'Maşınların texniki vəziyyət yoxlaması',
          columns: [
            { id: '1', name: 'Yağ səviyyəsi', dataType: 'boolean', required: true },
            { id: '2', name: 'Təkər təzyiqi', dataType: 'boolean', required: true },
            { id: '3', name: 'Təmizlik', dataType: 'boolean', required: true },
            { id: '4', name: 'Yanacaq səviyyəsi', dataType: 'select', options: ['Tam', 'Yarı', 'Az', 'Boş'], required: true },
            { id: '5', name: 'Vəziyyət', dataType: 'select', options: ['Əla', 'Yaxşı', 'Təmir tələb edir'], required: true },
          ],
          createdAt: new Date().toISOString(),
          isActive: true
        },
      ];
      setTableDefinitions(sampleTables);
      localStorage.setItem('tableDefinitions', JSON.stringify(sampleTables));
    }
    setLoading(false);
  }, []);

  // Save table definitions to localStorage
  const saveTableDefinitions = (updatedTables: TableDefinitionType[]) => {
    localStorage.setItem('tableDefinitions', JSON.stringify(updatedTables));
    setTableDefinitions(updatedTables);
  };

  // Add or update table definition
  const handleSaveTable = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingTable) {
        // Update existing table
        const updatedTables = tableDefinitions.map(table => 
          table.id === editingTable.id 
            ? { 
                ...table, 
                name: values.name,
                description: values.description,
                buildingId: values.buildingId || undefined,
                floorId: values.floorId || undefined,
                columns: columnsList,
                isActive: values.isActive
              } 
            : table
        );
        saveTableDefinitions(updatedTables);
        message.success('Cədvəl məlumatları yeniləndi');
      } else {
        // Add new table
        const newTable: TableDefinitionType = {
          id: Date.now().toString(),
          name: values.name,
          description: values.description,
          buildingId: values.buildingId || undefined,
          floorId: values.floorId || undefined,
          columns: columnsList,
          createdAt: new Date().toISOString(),
          isActive: true // Default to active for new tables
        };
        saveTableDefinitions([...tableDefinitions, newTable]);
        console.log([...tableDefinitions, newTable]);
        message.success('Yeni cədvəl əlavə edildi');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingTable(null);
      setColumnsList([]);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Delete table
  const handleDeleteTable = (id: string) => {
    const updatedTables = tableDefinitions.filter(table => table.id !== id);
    saveTableDefinitions(updatedTables);
    message.success('Cədvəl silindi');
  };

  // Open edit table modal
  const handleEditTable = (record: TableDefinitionType) => {
    setEditingTable(record);
    setColumnsList([...record.columns]);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      buildingId: record.buildingId,
      floorId: record.floorId,
      isActive: record.isActive
    });
    setIsModalVisible(true);
  };

  // Open create table modal
  const handleAddTable = () => {
    setEditingTable(null);
    setColumnsList([]);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Get building name by ID
  const getBuildingName = (buildingId?: string) => {
    if (!buildingId) return '-';
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.name : '-';
  };

  // Get floor name by ID
  const getFloorName = (floorId?: string) => {
    if (!floorId) return '-';
    const floor = floors.find(f => f.id === floorId);
    return floor ? floor.name : '-';
  };

  // Get filtered floors by building
  const getFilteredFloors = (buildingId?: string) => {
    if (!buildingId) return floors;
    return floors.filter(floor => floor.buildingId === buildingId);
  };

  // Open visual table builder
  const handleOpenVisualBuilder = () => {
    setVisualBuilderVisible(true);
  };

  // Add new column to visual table
  const handleAddVisualColumn = () => {
    const newColIndex = visualColumns.length + 1;
    const newColKey = `col${newColIndex}`;
    
    // Add column to columns
    setVisualColumns([
      ...visualColumns, 
      {
        title: `Başlıq ${newColIndex}`, 
        dataIndex: newColKey, 
        key: newColKey,
        dataType: 'string', // Set default data type to string
        editable: false,    // Set editable to false by default
        required: true
      }
    ]);
    
    // Add empty value for this column to all rows
    setVisualRows(rows => rows.map(row => ({
      ...row,
      [newColKey]: ''
    })));
  };

  // Remove column from visual table
  const handleRemoveVisualColumn = (index: number) => {
    if (visualColumns.length <= 1) {
      message.warning('Ən azı bir sütun olmalıdır');
      return;
    }
    
    const colToRemove = visualColumns[index].dataIndex;
    
    // Remove column from columns array
    setVisualColumns(cols => cols.filter((_, i) => i !== index));
    
    // Remove this column from all rows
    setVisualRows(rows => rows.map(row => {
      const newRow = {...row};
      delete newRow[colToRemove];
      return newRow;
    }));
  };

  // Add new row to visual table
  const handleAddVisualRow = () => {
    const newRowKey = (visualRows.length + 1).toString();
    const newRow: Record<string, any> = { key: newRowKey };
    
    // Add empty value for each column
    visualColumns.forEach(col => {
      newRow[col.dataIndex] = '';
    });
    
    setVisualRows([...visualRows, newRow]);
  };

  // Remove row from visual table
  const handleRemoveVisualRow = (index: number) => {
    if (visualRows.length <= 1) {
      message.warning('Ən azı bir sətir olmalıdır');
      return;
    }
    
    setVisualRows(rows => rows.filter((_, i) => i !== index));
  };

  // Start editing a column header
  const handleStartEditHeader = (index: number) => {
    const columnTitle = visualColumns[index].title;
    setEditingHeader({
      index,
      value: columnTitle
    });
  };

  // Save edited column header
  const handleSaveHeader = () => {
    if (editingHeader) {
      setVisualColumns(cols => cols.map((col, index) => 
        index === editingHeader.index 
          ? {...col, title: editingHeader.value} 
          : col
      ));
      setEditingHeader(null);
    }
  };

  // Update handleOpenColumnSettings to initialize formula field
  const handleOpenColumnSettings = (index: number) => {
    setCurrentColumnIndex(index);
    const column = visualColumns[index];
    
    // Set form values based on column data
    columnSettingsForm.setFieldsValue({
      dataType: column.dataType,
      editable: column.dataType === 'boolean' || column.dataType === 'number' ? true : column.editable,
      required: column.required,
      formula: column.formula || '' // Initialize formula field
    });
  };

  // Update handleSaveColumnSettings to validate select options
  const handleSaveColumnSettings = async () => {
    try {
      if (currentColumnIndex === null) return;
      
      const values = await columnSettingsForm.validateFields();
      
      // Validate select type options
      if (values.dataType === 'select') {
        const currentColumn = visualColumns[currentColumnIndex];
        if (!currentColumn.options || currentColumn.options.length === 0) {
          message.error('Heç bir seçim əlavə etmədiyiniz üçün Yadda saxlaya bilməzsiniz!');
          return;
        }
      }
      
      // Update column settings
      setVisualColumns(columns => columns.map((col, index) => 
        index === currentColumnIndex
          ? { 
              ...col, 
              ...values,
              options: values.dataType === 'select' 
                ? (col.options && col.options.length > 0 ? col.options : undefined)
                : undefined,
              formula: values.dataType === 'formula' ? values.formula.toString() : undefined,
              editable: values.dataType === 'boolean' || values.dataType === 'select' || values.dataType === 'formula' ? true : values.editable
            }
          : col
      ));
      
      // Update rows based on the new data type
      setVisualRows(rows => rows.map(row => {
        const newRow = { ...row };
        const columnKey = visualColumns[currentColumnIndex].dataIndex;
        
        if (values.dataType === 'formula' && values.formula) {
          newRow[columnKey] = values.formula.toString();
        } else if (values.dataType === 'boolean') {
          newRow[columnKey] = true;
        } else if (values.dataType === 'number') {
          newRow[columnKey] = '';
        } else if (values.dataType === 'string') {
          newRow[columnKey] = '';
        } else if (values.dataType === 'select') {
          newRow[columnKey] = undefined;
        } else {
          newRow[columnKey] = '';
        }
        
        return newRow;
      }));
      
      setCurrentColumnIndex(null);
      setOptionInput('');
      message.success('Sütun parametrləri yeniləndi');
    } catch (error) {
      console.error('Column settings validation failed:', error);
    }
  };

  // Add option to select
  const handleAddOption = () => {
    if (!optionInput.trim()) {
      message.warning('Boş seçim əlavə edilə bilməz');
      return;
    }

    if (currentColumnIndex === null) return;

    setVisualColumns(columns => columns.map((col, index) => 
      index === currentColumnIndex
        ? { 
            ...col, 
            options: Array.isArray(col.options) 
              ? [...col.options, optionInput.trim()] 
              : [optionInput.trim()]
          }
        : col
    ));
    
    setOptionInput('');
  };

  // Add function to remove option
  const handleRemoveOption = (option: string) => {
    if (currentColumnIndex === null) return;
    
    setVisualColumns(columns => columns.map((col, index) => 
      index === currentColumnIndex
        ? { 
            ...col, 
            options: (col.options || []).filter(o => o !== option)
          }
        : col
    ));
    
    message.success('Seçim silindi');
  };

  // Apply visual builder columns to the form
  const handleApplyVisualBuilder = () => {
    // Convert visual columns to table columns
    const newColumns: TableColumnType[] = visualColumns.map((col, index) => {
      const rows: Array<{
        name: string;
        dataType: ColumnDataType;
        required: boolean;
        editable: boolean;
        value: string | null;
        options: string[] | null;
      }> = [
        {
          name: "Otaqlar",
          dataType: "string",
          required: true,
          editable: false,
          value: "HR",
          options: null,
        },
        {
          name: "Rey yaz",
          dataType: "string",
          required: true,
          editable: true,
          value: null,
          options: null,
        },
        {
          name: "Kondisaner var",
          dataType: "boolean",
          required: true,
          editable: true,
          value: null,
          options: null,
        }
      ];

      const matchingRow = rows.find(row => row.name === col.title);
      
      return {
        id: Date.now().toString() + index,
        name: col.title,
        dataType: matchingRow?.dataType || col.dataType,
        required: matchingRow?.required ?? col.required,
        editable: matchingRow?.editable ?? col.editable,
        options: matchingRow?.options || undefined,
        value: matchingRow?.value || null,
        values: []
      };
    });
    
    setColumnsList(newColumns);
    setVisualBuilderVisible(false);
    message.success('Cədvəl strukturu tətbiq edildi');
  };

  // Get data type tag color for visual builder
  const getDataTypeTagForVisual = (column: VisualColumnType) => {
    let color = getTagColorByDataType(column.dataType);
    let label = getDataTypeLabel(column.dataType);
    
    return (
      <div>{label}</div>
    );
  };

  // Update the showModal function to include visual builder option
  const showModal = () => {
    setIsModalVisible(true);
    setEditingTable(null);
    form.resetFields();
  };

  const handleVisualBuilder = () => {
    setVisualBuilderVisible(true);
    setIsModalVisible(false);
  };

  const handleVisualBuilderSave = (columns: TableColumnType[]) => {
    form.setFieldsValue({ columns });
    setVisualBuilderVisible(false);
    setIsModalVisible(true);
  };

  // Handle save column
  const handleSaveColumn = async () => {
    try {
      const values = await columnsForm.validateFields();
      
      if (editingColumn) {
        // Update existing column
        const updatedColumns = columnsList.map(column => 
          column.id === editingColumn.id 
            ? { 
                ...column, 
                name: values.name,
                dataType: values.dataType,
                options: values.dataType === 'select' ? values.options.split(',').map((o: string) => o.trim()) : undefined,
                customRows: values.dataType === 'custom-rows' ? values.customRows.split('\n').map((row: string) => row.trim()).filter((row: string) => row !== '') : undefined,
                required: values.required
              } 
            : column
        );
        setColumnsList(updatedColumns);
        message.success('Sütun yeniləndi');
      } else {
        // Add new column
        const columnKey = `column_${Date.now()}`;
        const newColumn: TableColumnType = {
          id: Date.now().toString(),
          name: values.name,
          dataType: values.dataType,
          options: values.dataType === 'select' ? ['1', '2', '3', '4', '5'] : undefined,
          required: values.required
        };
        setColumnsList([...columnsList, newColumn]);
        message.success('Yeni sütun əlavə edildi');
      }
      
      setColumnModalVisible(false);
      columnsForm.resetFields();
      setEditingColumn(null);
    } catch (error) {
      console.error('Column form validation failed:', error);
    }
  };

  // Delete column
  const handleDeleteColumn = (columnId: string) => {
    const updatedColumns = columnsList.filter(column => column.id !== columnId);
    setColumnsList(updatedColumns);
    message.success('Sütun silindi');
  };

  // Handle edit column
  const handleEditColumn = (column: TableColumnType) => {
    setEditingColumn(column);
    columnsForm.setFieldsValue({
      name: column.name,
      dataType: column.dataType,
      options: column.options ? column.options.join(', ') : '',
      customRows: column.customRows ? column.customRows.join('\n') : '',
      required: column.required
    });
    setColumnModalVisible(true);
  };

  // Open create column modal
  const handleAddColumn = () => {
    if (!newColumnName.trim()) {
      message.warning('Sütun adı boş ola bilməz');
      return;
    }

    const columnKey = `column_${Date.now()}`;
    const newColumn: TableColumnType = {
      id: Date.now().toString(),
      name: newColumnName,
      dataType: newColumnType,
      options: newColumnType === 'select' ? ['1', '2', '3', '4', '5'] : undefined,
      required: false
    };

    const visualColumn: VisualColumnType = {
      title: newColumnName,
      dataIndex: columnKey,
      key: columnKey,
      dataType: newColumnType,
      editable: true,
      options: newColumnType === 'select' ? ['1', '2', '3', '4', '5'] : undefined,
      required: false
    };

    setVisualColumns([...visualColumns, visualColumn]);
    setNewColumnName('');
    setNewColumnType('string');
    message.success('Yeni sütun əlavə edildi');
  };

  // Toggle table status
  const handleToggleStatus = (tableId: string, newStatus: boolean) => {
    const updatedTables = tableDefinitions.map(table =>
      table.id === tableId
        ? { ...table, isActive: newStatus }
        : table
    );
    saveTableDefinitions(updatedTables);
    message.success(`Cədvəl ${newStatus ? 'aktivləşdirildi' : 'deaktiv edildi'}`);
  };

  // Initialize column order
  React.useEffect(() => {
    if (visualColumns.length > 0) {
      setColumnOrder(visualColumns.map(col => col.dataIndex));
    }
  }, [visualColumns]);

  // Handle column drag end
  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);
      
      const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
      setColumnOrder(newOrder);
      
      // Update visual columns order
      setVisualColumns(columns => {
        const newColumns = [...columns];
        const [movedColumn] = newColumns.splice(oldIndex, 1);
        newColumns.splice(newIndex, 0, movedColumn);
        return newColumns;
      });
    }
  };

  // Add formula calculation function
  const calculateFormula = (formula: string, row: any) => {
    try {
      // Replace column references with their values
      const columnNames = visualColumns.map(col => col.title);
      let calculatedFormula = formula;
      
      columnNames.forEach((name, index) => {
        const regex = new RegExp(name, 'g');
        const value = row[visualColumns[index].dataIndex] || 0;
        calculatedFormula = calculatedFormula.replace(regex, value);
      });
      
      // Evaluate the formula
      // eslint-disable-next-line no-eval
      return eval(calculatedFormula);
    } catch (error) {
      console.error('Formula calculation error:', error);
      return 'Error';
    }
  };

  const tableColumns: ColumnsType<TableDefinitionType> = [
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
          '-'
      ),
    },
    {
      title: 'Mərtəbə',
      key: 'floor',
      width: 150,
      render: (_, record) => (
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
            onClick={() => handleEditTable(record)}
          />
                <Popconfirm
            title="Bu cədvəli silmək istədiyinizə əminsiniz?"
            description="Bu əməliyyat geri qaytarıla bilməz"
            onConfirm={() => handleDeleteTable(record.id)}
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

  // Column settings content for Popover
  const columnSettingsContent = (
    <div style={{ width: 400, padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Typography.Title level={5} style={{ margin: 0 }}>Sütun Parametrləri</Typography.Title>
        <Typography.Text type="secondary">Sütunun xüsusiyyətlərini tənzimləyin</Typography.Text>
      </div>

      <Form
        form={columnSettingsForm}
        layout="vertical"
        name="column_settings_form"
        style={{ marginBottom: '16px' }}
      >
        <Form.Item
          name="dataType"
          label="Məlumat Tipi"
          rules={[{ required: true, message: 'Məlumat tipini seçin!' }]}
        >
          <Select 
            style={{ width: '100%' }}
            onChange={(value) => {
              if (value === 'boolean') {
                columnSettingsForm.setFieldsValue({ editable: true });
              } else if (value === 'select') {
                columnSettingsForm.setFieldsValue({ editable: true });
              } else if (value === 'formula') {
                columnSettingsForm.setFieldsValue({ editable: true });
              }
            }}
          >
            <Select.Option value="boolean">Hə/Yox</Select.Option>
            <Select.Option value="string">Mətn</Select.Option>
            <Select.Option value="select">Seçim</Select.Option>
            <Select.Option value="number">Rəqəm</Select.Option>
            <Select.Option value="formula">Düstur</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => 
            prevValues.dataType !== currentValues.dataType
          }
        >
          {({ getFieldValue }) => (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="editable"
                  label="Daxil oluna bilən"
                  valuePropName="checked"
                  tooltip="Əməkdaş bura məlumat daxil edə biləcək"
                >
                  <Switch
                    disabled={getFieldValue('dataType') === 'boolean' || getFieldValue('dataType') === 'select' || getFieldValue('dataType') === 'formula'}
                    checked={getFieldValue('dataType') === 'boolean' || getFieldValue('dataType') === 'select' || getFieldValue('dataType') === 'formula' ? true : getFieldValue('editable')}
                    onChange={(checked) => {
                      columnSettingsForm.setFieldsValue({ editable: checked });
                    }}
                    checkedChildren="Bəli"
                    unCheckedChildren="Xeyr"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="required"
                  label="Məcburi"
                  valuePropName="checked"
                  tooltip="Bu sütun mütləq doldurulmalıdır"
                >
                  <Switch
                    checked={getFieldValue('required')}
                    onChange={(checked) => {
                      columnSettingsForm.setFieldsValue({ required: checked });
                    }}
                    checkedChildren="Bəli"
                    unCheckedChildren="Xeyr"
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form.Item>
        
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => 
            prevValues.dataType !== currentValues.dataType
          }
        >
          {({ getFieldValue }) => 
            getFieldValue('dataType') === 'formula' ? (
              <div style={{ marginTop: '8px' }}>
                <div style={{ marginBottom: '4px' }}>
                  <Typography.Text strong>Düstur</Typography.Text>
                </div>
                
                <div style={{ 
                  maxHeight: '120px', 
                  overflowY: 'auto',
                  padding: '4px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px',
                  backgroundColor: '#fafafa',
                  marginBottom: '8px'
                }}>
                  <Space direction="vertical" size={[4, 4]} style={{ width: '100%' }}>
                    <Space wrap size={[2, 2]}>
                      {visualColumns.map((col, index) => (
                        <Button
                          key={col.dataIndex}
                          type="text"
                          size="small"
                          onClick={() => {
                            const currentFormula = columnSettingsForm.getFieldValue('formula') || '';
                            columnSettingsForm.setFieldsValue({
                              formula: currentFormula + (currentFormula ? ' ' : '') + col.title
                            });
                          }}
                        >
                          {col.title}
                        </Button>
                      ))}
                    </Space>
                    
                    <Space wrap size={[2, 2]}>
                      <Button
                        type="text"
                        size="small"
                        onClick={() => {
                          const currentFormula = columnSettingsForm.getFieldValue('formula') || '';
                          columnSettingsForm.setFieldsValue({
                            formula: currentFormula + (currentFormula ? ' ' : '') + '('
                          });
                        }}
                      >
                        (
                      </Button>
                      <Button
                        type="text"
                        size="small"
                        onClick={() => {
                          const currentFormula = columnSettingsForm.getFieldValue('formula') || '';
                          columnSettingsForm.setFieldsValue({
                            formula: currentFormula + (currentFormula ? ' ' : '') + ')'
                          });
                        }}
                      >
                        )
                      </Button>
                      <Button
                        type="text"
                        size="small"
                        onClick={() => {
                          const currentFormula = columnSettingsForm.getFieldValue('formula') || '';
                          columnSettingsForm.setFieldsValue({
                            formula: currentFormula + (currentFormula ? ' ' : '') + '+'
                          });
                        }}
                      >
                        +
                      </Button>
                      <Button
                        type="text"
                        size="small"
                        onClick={() => {
                          const currentFormula = columnSettingsForm.getFieldValue('formula') || '';
                          columnSettingsForm.setFieldsValue({
                            formula: currentFormula + (currentFormula ? ' ' : '') + '-'
                          });
                        }}
                      >
                        -
                      </Button>
                      <Button
                        type="text"
                        size="small"
                        onClick={() => {
                          const currentFormula = columnSettingsForm.getFieldValue('formula') || '';
                          columnSettingsForm.setFieldsValue({
                            formula: currentFormula + (currentFormula ? ' ' : '') + '*'
                          });
                        }}
                      >
                        ×
                      </Button>
                      <Button
                        type="text"
                        size="small"
                        onClick={() => {
                          const currentFormula = columnSettingsForm.getFieldValue('formula') || '';
                          columnSettingsForm.setFieldsValue({
                            formula: currentFormula + (currentFormula ? ' ' : '') + '/'
                          });
                        }}
                      >
                        ÷
                      </Button>
                      <Button
                        type="text"
                        danger
                        size="small"
                        onClick={() => {
                          columnSettingsForm.setFieldsValue({
                            formula: ''
                          });
                        }}
                      >
                        Sil
                      </Button>
                    </Space>

                    <Space wrap size={[2, 2]}>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <Button
                          key={num}
                          type="text"
                          size="small"
                          onClick={() => {
                            const currentFormula = columnSettingsForm.getFieldValue('formula') || '';
                            columnSettingsForm.setFieldsValue({
                              formula: currentFormula + (currentFormula ? ' ' : '') + num
                            });
                          }}
                        >
                          {num}
                        </Button>
                      ))}
                    </Space>
                  </Space>
                </div>
                
                <Form.Item
                  name="formula"
                  rules={[{ required: true, message: 'Düsturu daxil edin!' }]}
                  style={{ margin: 0 }}
                >
                  <Input.TextArea
                    value={columnSettingsForm.getFieldValue('formula')}
                    onChange={(e) => {
                      columnSettingsForm.setFieldsValue({
                        formula: e.target.value
                      });
                    }}
                    style={{ 
                      backgroundColor: '#fafafa',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      padding: '8px',
                      minHeight: '60px',
                      maxHeight: '120px',
                    }}
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    readOnly
                  />
                </Form.Item>
              </div>
            ) : null
          }
        </Form.Item>
        
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => 
            prevValues.dataType !== currentValues.dataType
          }
        >
          {({ getFieldValue }) => 
            getFieldValue('dataType') === 'select' && currentColumnIndex !== null ? (
              <div style={{ marginTop: '16px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <Typography.Text strong>Seçimlər</Typography.Text>
                  <Typography.Text type="secondary" style={{ marginLeft: '8px' }}>
                    Yeni seçim əlavə edin
                  </Typography.Text>
                </div>
                
                <Space.Compact style={{ width: '100%', marginBottom: '12px' }}>
                  <Input 
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    placeholder="Yeni seçim"
                    onPressEnter={handleAddOption}
                    style={{ width: '100%' }}
                  />
                  <Button type="primary" onClick={handleAddOption}>Əlavə et</Button>
                </Space.Compact>
                
                {visualColumns[currentColumnIndex].options && visualColumns[currentColumnIndex].options!.length > 0 && (
                  <div style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    padding: '8px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    backgroundColor: '#fafafa'
                  }}>
                    <List
                      size="small"
                      dataSource={visualColumns[currentColumnIndex].options}
                      renderItem={(option: string) => (
                        <List.Item
                          actions={[
                            <Button
                              type="text"
                              danger
                              icon={<CloseOutlined />}
                              onClick={() => handleRemoveOption(option)}
                              size="small"
                            />
                          ]}
                        >
                          {option}
                        </List.Item>
                      )}
                    />
                  </div>
                )}
              </div>
            ) : null
          }
        </Form.Item>
      </Form>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '8px',
        borderTop: '1px solid #f0f0f0',
        paddingTop: '16px',
        marginTop: '16px'
      }}>
        <Button 
          onClick={() => setCurrentColumnIndex(null)}
          style={{ minWidth: '80px' }}
        >
          Ləğv et
        </Button>
        <Button 
          type="primary" 
          onClick={handleSaveColumnSettings}
          style={{ minWidth: '80px' }}
        >
          Yadda Saxla
        </Button>
      </div>
    </div>
  );

  // Update the visual table builder columns rendering
  const visualTableColumns = [
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
                    onClick={() => handleRemoveVisualRow(index)}
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
                      onChange={(e) => {
                        const newColumns = [...visualColumns];
                        newColumns[index] = {
                          ...newColumns[index],
                          title: e.target.value
                        };
                        setVisualColumns(newColumns);
                      }}
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
                            handleOpenColumnSettings(index);
                          } else {
                            setCurrentColumnIndex(null);
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
                        onClick={() => handleRemoveVisualColumn(index)}
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
                      <Radio.Group buttonStyle="solid" size="small" value={undefined}>
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
                        onChange={(e) => {
                          const newRows = [...visualRows];
                          newRows[rowIndex] = {
                            ...newRows[rowIndex],
                            [column.dataIndex]: e.target.value
                          };
                          setVisualRows(newRows);
                        }}
                      />
                    </div>
                  );
                } else if (column.dataType === 'string') {
                  return (
                    <div style={{ padding: '0', width: '100%', height: '100%', position: 'relative', textAlign: 'left' }}>
                      <Input 
                        placeholder={column.editable ? "Yoxlama aparan şəxs tərəfindən daxil edilir" : ""}
                        bordered={false}
                        size="middle"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          textAlign: 'left',
                          background: 'transparent',
                          border: !column.editable  ? 'none' :"1px solid #d9d9d9",
                          // boxShadow: 'none',
                          // padding: '0'
                        }}
                        value={record[column.dataIndex] || ''}
                        onChange={(e) => {
                          const newRows = [...visualRows];
                          newRows[rowIndex] = {
                            ...newRows[rowIndex],
                            [column.dataIndex]: e.target.value
                          };
                          setVisualRows(newRows);
                        }}
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
                        value={undefined}
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
                } else {
                  return <Input placeholder="" bordered={false} value="" />;
                }
              }
            }))
  ];
        
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Cədvəllərin İdarə Edilməsi</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
          onClick={handleAddTable}
        >
          Yeni Cədvəl
          </Button>
        </div>
      
      <Card>
        <Table 
          columns={tableColumns} 
          dataSource={tableDefinitions} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Cədvəl yoxdur' }}
        />
      </Card>
      
      {/* Table Definition Drawer */}
      <Drawer
        title={editingTable ? "Cədvəli Düzəlt" : "Yeni Cədvəl Əlavə Et"}
        placement="right"
        onClose={() => {
          setIsModalVisible(false);
          form.resetFields();
          setColumnsList([]);
        }}
        open={isModalVisible}
        width="100%"
        extra={
          <Space>
            <Button onClick={() => {
              setIsModalVisible(false);
              form.resetFields();
              setColumnsList([]);
            }}>
              Ləğv et
            </Button>
            <Button type="primary" onClick={handleSaveTable}>
              {editingTable ? "Yenilə" : "Əlavə et"}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          name="table_form"
        >
          <Row gutter={16}>
          
            
            <Col span={12}>
          <Form.Item
                name="buildingId"
                label="Bina"
              >
                <Select 
                  placeholder="Bina seçin (istəyə bağlı)" 
                  allowClear
                  onChange={(value) => {
                    // Clear floor selection if building changes
                    if (!value) {
                      form.setFieldsValue({ floorId: undefined });
                    }
                  }}
                >
                  {buildings.map(building => (
                    <Option key={building.id} value={building.id}>{building.name}</Option>
                  ))}
            </Select>
          </Form.Item>
            </Col>
            <Col span={12}>
          <Form.Item
                name="floorId"
                label="Mərtəbə"
                dependencies={['buildingId']}
              >
                <Select 
                  placeholder="Mərtəbə seçin (istəyə bağlı)" 
                  allowClear
                >
                  {getFilteredFloors(form.getFieldValue('buildingId')).map(floor => (
                    <Option key={floor.id} value={floor.id}>{floor.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
          <Form.Item
                name="name"
                label="Cədvəl Adı"
                rules={[{ required: true, message: 'Cədvəlin adını daxil edin!' }]}
              >
                <Input placeholder="məsələn: Ofis Otağı Yoxlaması" />
          </Form.Item>
            </Col>
            
        
          </Row>
          
          <Form.Item
            name="description"
            label="Təsvir"
            rules={[{ required: true, message: 'Təsviri daxil edin!' }]}
          >
            <Input.TextArea rows={3} placeholder="Cədvəl haqqında qısa məlumat" />
          </Form.Item>

          {editingTable && (
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
        
        <Divider orientation="left">Cədvəl Sütunları</Divider>
        
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          <Button 
            type="primary" 
            icon={<TableOutlined />} 
            onClick={handleOpenVisualBuilder}
            style={{ width: '100%' }}
          >
            Cədvəli Vizual Olaraq Formalaşdır
          </Button>
        </div>
                  
                  <List
                    bordered
          dataSource={columnsList}
          renderItem={column => (
                      <List.Item
                        actions={[
                <Button 
                  icon={<EditOutlined />} 
                  type="text" 
                  onClick={() => handleEditColumn(column)}
                />,
                <Popconfirm
                  title="Bu sütunu silmək istədiyinizə əminsiniz?"
                  onConfirm={() => handleDeleteColumn(column.id)}
                  okText="Bəli"
                  cancelText="Xeyr"
                >
                          <Button 
                            icon={<DeleteOutlined />} 
                            type="text" 
                            danger
                  />
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                title={column.name}
                description={
                  <>
                    <Tag color={getTagColorByDataType(column.dataType)}>
                      {getDataTypeLabel(column.dataType)}
                    </Tag>
                    {column.required && <Tag color="red">Məcburi</Tag>}
                    {column.dataType === 'select' && column.options && (
                      <Tag color="orange">Seçimlər: {column.options.join(', ')}</Tag>
                    )}
                    {column.dataType === 'custom-rows' && column.customRows && (
                      <Tag color="purple">Sıralar: {column.customRows.length} ədəd</Tag>
                    )}
                  </>
                }
              />
                      </List.Item>
                    )}
          locale={{ emptyText: 'Sütun yoxdur. Yeni sütun əlavə edin.' }}
        />
      </Drawer>
      
      {/* Column Definition Drawer */}
      <Drawer
        title={editingColumn ? "Sütunu Düzəlt" : "Yeni Sütun Əlavə Et"}
        placement="right"
        onClose={() => {
          setColumnModalVisible(false);
          columnsForm.resetFields();
        }}
        open={columnModalVisible}
        width="100%"
        extra={
          <Space>
            <Button onClick={() => {
              setColumnModalVisible(false);
              columnsForm.resetFields();
            }}>
              Ləğv et
            </Button>
            <Button type="primary" onClick={handleSaveColumn}>
              {editingColumn ? "Yenilə" : "Əlavə et"}
            </Button>
          </Space>
        }
      >
        <Form
          form={columnsForm}
          layout="vertical"
          name="column_form"
        >
          <Form.Item
            name="name"
            label="Sütun Adı"
            rules={[{ required: true, message: 'Sütun adını daxil edin!' }]}
          >
            <Input placeholder="məsələn: Işıq" />
          </Form.Item>
          
          <Form.Item
            name="dataType"
            label="Məlumat Tipi"
            rules={[{ required: true, message: 'Məlumat tipini seçin!' }]}
            initialValue="boolean"
          >
            <Select>
              <Option value="boolean">Hə/Yox</Option>
              <Option value="string">Mətn</Option>
              <Option value="select">Seçim</Option>
              <Option value="number">Rəqəm</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.dataType !== currentValues.dataType
            }
          >
            {({ getFieldValue }) => 
              getFieldValue('dataType') === 'select' ? (
                <Form.Item
                  name="options"
                  label="Seçimlər"
                  rules={[{ required: true, message: 'Seçimləri daxil edin!' }]}
                  tooltip="Vergüllə ayrılmış seçimlər siyahısı"
                >
                  <Input.TextArea 
                    rows={3} 
                    placeholder="məsələn: Əla, Yaxşı, Orta, Pis"
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Drawer>
      
      {/* Visual Table Builder Drawer */}
      <Drawer
        title="Cədvəl Strukturunu Vizual Olaraq Formalaşdır"
        placement="right"
        onClose={() => setVisualBuilderVisible(false)}
        open={visualBuilderVisible}
        width="100%"
        extra={
          <Space>
            <Button onClick={() => setVisualBuilderVisible(false)}>
              Ləğv et
            </Button>
            <Button type="primary" onClick={handleApplyVisualBuilder}>
              Tətbiq Et
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Typography.Text type="secondary">
            Sütun başlıqlarını dəyişdirmək üçün başlığa klik edin
          </Typography.Text>
        </div>
        
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleColumnDragEnd}
        >
          <SortableContext
            items={columnOrder}
            strategy={verticalListSortingStrategy}
          >
            <Table
              dataSource={visualRows}
              bordered
              columns={visualTableColumns}
              pagination={false}
              size="small"
            />
          </SortableContext>
        </DndContext>
        
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
          <Button 
            onClick={handleAddVisualColumn}
            icon={<ColumnWidthOutlined />}
          >
            Sütun Əlavə Et
          </Button>
          <Button 
            onClick={handleAddVisualRow}
            icon={<ColumnHeightOutlined />}
          >
            Sətir Əlavə Et
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default TableManagementPage; 