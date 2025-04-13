// Column data type options
export type ColumnDataType = 'boolean' | 'string' | 'select' | 'custom-rows' | 'number' | 'formula';

export interface BuildingType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface FloorType {
  id: string;
  key: string;
  name: string;
  label: string;
  description: string;
  buildingId?: string;
  createdAt: string;
}

export interface TableColumnType {
  id: string;
  name: string;
  dataType: ColumnDataType;
  options?: string[]; // For select type columns
  customRows?: string[]; // For custom row values like room names
  required: boolean;
  value?: string | null;
  values: any[];
}

export interface TableDefinitionType {
  id: string;
  name: string;
  description: string;
  buildingId?: string;
  floorId?: string;
  columns: TableColumnType[];
  createdAt: string;
  isActive: boolean;
}

// Add interface for visual column with configuration
export interface VisualColumnType {
  title: string;
  dataIndex: string;
  key: string;
  dataType: ColumnDataType;
  editable: boolean;
  required: boolean;
  options?: string[]; // Add options for select type
  formula?: string;
} 