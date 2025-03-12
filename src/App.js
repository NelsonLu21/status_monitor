import "./App.css";
import { useState } from "react";
import { Layout, Menu, Typography } from "antd";
import StatusTable from "./StatusTable";
import Scheduler from "./Scheduler";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const items = [
    {
        key: "1",
        label: "Status",
    },
    {
        key: "2",
        label: "Scheduler",
    },
];

function App() {
    const [selectedKey, setSelectedKey] = useState("1");
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Layout style={{ flex: 1 }}>
                <Header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "bold",
                        }}
                    >
                        STAD Team Dashboard
                    </Text>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={["1"]}
                        onClick={(e) => setSelectedKey(e.key)}
                        items={items}
                        style={{
                            flex: 1,
                            minWidth: 0,
                            paddingLeft: "20px",
                        }}
                    />
                </Header>
                <Content style={{ flex: 1, padding: "20px" }}>
                    {selectedKey === "1" && <StatusTable />}
                    {selectedKey === "2" && <Scheduler />}
                </Content>
            </Layout>
        </div>
    );
}

export default App;
