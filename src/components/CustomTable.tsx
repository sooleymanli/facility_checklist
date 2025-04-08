import React from 'react';
import { Table, theme, Radio } from 'antd';

const CustomTable: React.FC<{ tab?: string }> = ({ tab }) => {
  const { token } = theme.useToken();
  console.log('tab', tab);

  const generateData = () => {
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
      'Mühazirə Zalı',
      'Təchizat Otağı',
      'Maliyyə Otağı',
      'Satış Otağı',
      'Marketinq Otağı',
      'Təhlükəsizlik Otağı',
      'Server Otağı',
      'Dəhliz',
      'Sanitar Qovşaq',
      'Anbar',
      'Təmizlik Otağı',
      'Yeməkxana',
    ];

    return Array.from({ length: 22 }, (_, index) => ({
      key: index,
      column1: roomNames[index % roomNames.length],
      column2: null,
      column3: null,
      column4: null,
      column5: null,
      column6: null,
      column7: null,
      column8: null,
      column9: null,
      column10: null,
    }));
  };

  const columns:any = [
    { title: 'Otaq Adı', dataIndex: 'column1', key: 'column1', fixed: 'left', width: 150, ellipsis: true },
    {
      title: 'Işıq',
      dataIndex: 'column2',
      key: 'column2',
      width: 150,
      ellipsis: true,
      render: () => (
        <Radio.Group optionType="button">
          <Radio.Button value="yes" style={{ backgroundColor: 'transparent', }}
            className="radio-yes">Bəli</Radio.Button>
          <Radio.Button value="no" style={{ backgroundColor: 'transparent',  }}
            className="radio-no">Xeyr</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: 'Avadanlıq',
      dataIndex: 'column3',
      key: 'column3',
      width: 150,
      ellipsis: true,
      render: () => (
        <Radio.Group optionType="button">
          <Radio.Button value="yes" style={{ backgroundColor: 'transparent',  }}
            className="radio-yes">Bəli</Radio.Button>
          <Radio.Button value="no" style={{ backgroundColor: 'transparent',  }}
            className="radio-no">Xeyr</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: 'Masa altı',
      dataIndex: 'column4',
      key: 'column4',
      width: 150,
      ellipsis: true,
      render: () => (
        <Radio.Group optionType="button">
          <Radio.Button value="yes" style={{ backgroundColor: 'transparent',  }}
            className="radio-yes">Bəli</Radio.Button>
          <Radio.Button value="no" style={{ backgroundColor: 'transparent',  }}
            className="radio-no">Xeyr</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: 'Divar',
      dataIndex: 'column5',
      key: 'column5',
      width: 150,
      ellipsis: true,
      render: () => (
        <Radio.Group optionType="button">
          <Radio.Button value="yes" style={{ backgroundColor: 'transparent',  }}
            className="radio-yes">Bəli</Radio.Button>
          <Radio.Button value="no" style={{ backgroundColor: 'transparent',}}
            className="radio-no">Xeyr</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: 'Tavan',
      dataIndex: 'column6',
      key: 'column6',
      width: 150,
      ellipsis: true,
      render: () => (
        <Radio.Group optionType="button">
          <Radio.Button value="yes" style={{ backgroundColor: 'transparent', }}
            className="radio-yes">Bəli</Radio.Button>
          <Radio.Button value="no" style={{ backgroundColor: 'transparent',  }}
            className="radio-no">Xeyr</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: 'Pəncərə',
      dataIndex: 'column7',
      key: 'column7',
      width: 150,
      ellipsis: true,
      render: () => (
        <Radio.Group optionType="button">
          <Radio.Button value="yes" style={{ backgroundColor: 'transparent',  }}
            className="radio-yes">Bəli</Radio.Button>
          <Radio.Button value="no" style={{ backgroundColor: 'transparent', }}
            className="radio-no">Xeyr</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: 'Qapı',
      dataIndex: 'column8',
      key: 'column8',
      width: 150,
      ellipsis: true,
      render: () => (
        <Radio.Group optionType="button">
          <Radio.Button value="yes" style={{ backgroundColor: 'transparent',  }}
            className="radio-yes">Bəli</Radio.Button>
          <Radio.Button value="no" style={{ backgroundColor: 'transparent',  }}
            className="radio-no">Xeyr</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: 'Döşəmə',
      dataIndex: 'column9',
      key: 'column9',
      width: 150,
      ellipsis: true,
      render: () => (
        <Radio.Group optionType="button">
          <Radio.Button value="yes" style={{ backgroundColor: 'transparent',  }}
            className="radio-yes">Bəli</Radio.Button>
          <Radio.Button value="no" style={{ backgroundColor: 'transparent',  }}
            className="radio-no">Xeyr</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: 'Kreslo',
      dataIndex: 'column10',
      key: 'column10',
      width: 150,
      ellipsis: true,
      render: () => (
        <Radio.Group optionType="button">
          <Radio.Button value="yes" style={{ backgroundColor: 'transparent',  }}
            className="radio-yes">Bəli</Radio.Button>
          <Radio.Button value="no" style={{ backgroundColor: 'transparent',  }}
            className="radio-no">Xeyr</Radio.Button>
        </Radio.Group>
      ),
    },
  ];

  const styles = `
    .ant-radio-button-wrapper-checked.radio-yes {
      background-color:rgba(57, 160, 5, 0.74) !important;
      color: #fff !important;
      border-color: rgba(57, 160, 5, 0.74) !important;
    }
    .ant-radio-button-wrapper-checked.radio-no {
      background-color:rgba(238, 36, 39, 0.75) !important;
      color: #fff !important;
      border-color: rgba(238, 36, 39, 0.75)  !important;
    }
  `;

  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }

  const data = generateData();

  return (
    <div
      style={{
        background: token.colorBgContainer,
        color: token.colorTextBase,
        borderRadius: 8,
        width: '100%',
      }}
    >
      <Table
        columns={columns}
        bordered
        dataSource={data}
        scroll={{ x: 800 }}
        pagination={false}
        sticky={{ offsetHeader: -10 }}
      />
    </div>
  );
};

export default CustomTable;