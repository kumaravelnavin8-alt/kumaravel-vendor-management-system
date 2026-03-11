import { useState } from 'react';
import { Card, Tabs, Table, Button, Space, DatePicker, message } from 'antd';
import { FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import api from '../services/api';
import dayjs from 'dayjs';
import { exportPDF } from '../utils/pdfExport';

const { RangePicker } = DatePicker;

const Reports: React.FC = () => {
  const [prodData, setProdData] = useState([]);
  const [payData, setPayData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProdReport = async (dates: any) => {
    setLoading(true);
    try {
      const resp = await api.get('/reports/production', {
        params: { startDate: dates[0].toISOString(), endDate: dates[1].toISOString() }
      });
      setProdData(resp.data);
    } catch (error: unknown) { 
      console.error(error);
      message.error('Failed'); 
    } finally { setLoading(false); }
  };

  const fetchPayReport = async (dates: any) => {
      setLoading(true);
      try {
        const resp = await api.get('/reports/payments', {
          params: { startDate: dates[0].toISOString(), endDate: dates[1].toISOString() }
        });
        setPayData(resp.data);
      } catch (error: unknown) { 
        console.error(error);
        message.error('Failed'); 
      } finally { setLoading(false); }
    };

  const prodColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date', render: (val: string) => dayjs(val).format('DD-MM-YYYY') },
    { title: 'Loom #', dataIndex: ['loomId', 'loomNumber'], key: 'loomNumber' },
    { title: 'Meters', dataIndex: 'metersProduced', key: 'metersProduced' },
    { title: 'Shift', dataIndex: 'shift', key: 'shift' },
  ];

  const payColumns = [
      { title: 'Date', dataIndex: 'date', key: 'date', render: (val: string) => dayjs(val).format('DD-MM-YYYY') },
      { title: 'Party', dataIndex: 'partyName', key: 'partyName' },
      { title: 'Amount', dataIndex: 'amount', key: 'amount' },
      { title: 'Type', dataIndex: 'type', key: 'type' },
  ];

  return (
    <Card title="Reports & Analytics">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Production Report" key="1">
          <Space style={{ marginBottom: 16 }}>
             <RangePicker onChange={(dates) => dates && fetchProdReport(dates)} />
             <Button 
                icon={<FilePdfOutlined />} 
                danger 
                disabled={prodData.length === 0}
                onClick={() => exportPDF(
                    'Production Report',
                    ['Date', 'Loom #', 'Meters', 'Shift'],
                    prodData.map((d: any) => [
                        dayjs(d.date).format('DD-MM-YYYY'),
                        d.loomId?.loomNumber || 'N/A',
                        d.metersProduced,
                        d.shift
                    ]),
                    `Production_Report_${Date.now()}`
                )}
             >Export PDF</Button>
             <Button icon={<FileExcelOutlined />} style={{ color: 'green' }}>Export Excel</Button>
          </Space>
          <Table dataSource={prodData} columns={prodColumns} rowKey="_id" loading={loading} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Payment Report" key="2">
            <Space style={{ marginBottom: 16 }}>
               <RangePicker onChange={(dates) => dates && fetchPayReport(dates)} />
               <Button 
                icon={<FilePdfOutlined />} 
                danger
                disabled={payData.length === 0}
                onClick={() => exportPDF(
                    'Payment Report',
                    ['Date', 'Party', 'Amount', 'Type'],
                    payData.map((d: any) => [
                        dayjs(d.date).format('DD-MM-YYYY'),
                        d.partyName,
                        d.amount.toLocaleString(),
                        d.type
                    ]),
                    `Payment_Report_${Date.now()}`
                )}
               >Export PDF</Button>
            </Space>
            <Table dataSource={payData} columns={payColumns} rowKey="_id" loading={loading} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default Reports;
