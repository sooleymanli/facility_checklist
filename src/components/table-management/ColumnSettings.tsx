import React from 'react';
import { Form, Select, Switch, Input, Button, Space, List, Typography, Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { VisualColumnType } from '../../types/tableManagement';

interface ColumnSettingsProps {
  form: any;
  currentColumn: VisualColumnType | null;
  optionInput: string;
  onOptionInputChange: (value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (option: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ColumnSettings: React.FC<ColumnSettingsProps> = ({
  form,
  currentColumn,
  optionInput,
  onOptionInputChange,
  onAddOption,
  onRemoveOption,
  onSave,
  onCancel
}) => {
  return (
    <div style={{ width: 400, padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Typography.Title level={5} style={{ margin: 0 }}>Sütun Parametrləri</Typography.Title>
        <Typography.Text type="secondary">Sütunun xüsusiyyətlərini tənzimləyin</Typography.Text>
      </div>

      <Form
        form={form}
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
              if (value === 'boolean' || value === 'select' || value === 'formula') {
                form.setFieldsValue({ editable: true });
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
                    disabled={['boolean', 'select', 'formula'].includes(getFieldValue('dataType'))}
                    checked={['boolean', 'select', 'formula'].includes(getFieldValue('dataType')) ? true : getFieldValue('editable')}
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
            getFieldValue('dataType') === 'formula' && (
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
                      {currentColumn?.title && (
                        <Button
                          type="text"
                          size="small"
                          onClick={() => {
                            const currentFormula = form.getFieldValue('formula') || '';
                            form.setFieldsValue({
                              formula: currentFormula + (currentFormula ? ' ' : '') + currentColumn.title
                            });
                          }}
                        >
                          {currentColumn.title}
                        </Button>
                      )}
                    </Space>
                    
                    <Space wrap size={[2, 2]}>
                      {['(', ')', '+', '-', '*', '/'].map(operator => (
                        <Button
                          key={operator}
                          type="text"
                          size="small"
                          onClick={() => {
                            const currentFormula = form.getFieldValue('formula') || '';
                            form.setFieldsValue({
                              formula: currentFormula + (currentFormula ? ' ' : '') + operator
                            });
                          }}
                        >
                          {operator === '*' ? '×' : operator === '/' ? '÷' : operator}
                        </Button>
                      ))}
                      <Button
                        type="text"
                        danger
                        size="small"
                        onClick={() => form.setFieldsValue({ formula: '' })}
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
                            const currentFormula = form.getFieldValue('formula') || '';
                            form.setFieldsValue({
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
            )
          }
        </Form.Item>
        
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => 
            prevValues.dataType !== currentValues.dataType
          }
        >
          {({ getFieldValue }) => 
            getFieldValue('dataType') === 'select' && currentColumn && (
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
                    onChange={(e) => onOptionInputChange(e.target.value)}
                    placeholder="Yeni seçim"
                    onPressEnter={onAddOption}
                    style={{ width: '100%' }}
                  />
                  <Button type="primary" onClick={onAddOption}>Əlavə et</Button>
                </Space.Compact>
                
                {currentColumn.options && currentColumn.options.length > 0 && (
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
                      dataSource={currentColumn.options}
                      renderItem={(option: string) => (
                        <List.Item
                          actions={[
                            <Button
                              type="text"
                              danger
                              icon={<CloseOutlined />}
                              onClick={() => onRemoveOption(option)}
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
            )
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
          onClick={onCancel}
          style={{ minWidth: '80px' }}
        >
          Ləğv et
        </Button>
        <Button 
          type="primary" 
          onClick={onSave}
          style={{ minWidth: '80px' }}
        >
          Yadda Saxla
        </Button>
      </div>
    </div>
  );
};

export default ColumnSettings; 