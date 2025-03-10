import { useEffect, useState } from "react";
import { Space, Table, Tag } from 'antd';

const API_URL = "https://status-monitor-backend-284b10dff973.herokuapp.com/status";

const columns = [
  {
    title: 'Computer',
    dataIndex: 'computer',
    key: 'computer',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
  },
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
  },
];


function StatusTable() {
  const [computers, setComputers] = useState([]);

  useEffect(() => {
    const fetchStatus = () => {
      fetch(API_URL)
        .then(data => data.json())
        .then(data => setComputers(data))
        .catch(error => console.error("Error fetching data:", error));
    };

    fetchStatus();
    console.log(computers)
    const interval = setInterval(fetchStatus, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={computers} bordered={true} style={{margin: "20px"}}/>
    </div>
  );
}

export default StatusTable;