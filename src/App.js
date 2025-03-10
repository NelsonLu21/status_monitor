import logo from './logo.svg';
import './App.css';
import StatusTable from './StatusTable';
import { Typography } from "antd";

function App() {
  return (
    <div>
      <Typography.Title style={{ margin: 20 }}>
        STAD Team - Status Monitor
      </Typography.Title>
      <StatusTable/>
    </div>
  );
}

export default App;
