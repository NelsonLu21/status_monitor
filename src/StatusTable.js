import { useEffect, useState } from "react";
import { Table, Modal } from "antd";

const API_URL =
    "https://status-monitor-backend-284b10dff973.herokuapp.com/status";

function StatusTable() {
    const [computers, setComputers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selected, setSelected] = useState(null);

    const showInfo = (computerIndex) => {
        setSelected(computerIndex);
        setModalVisible(true);
    };

    const columns = [
        {
            title: "Computer",
            dataIndex: "computer",
            key: "computer",
            render: (text) => (
                <a onClick={() => showInfo(text)} style={{ cursor: "pointer" }}>
                    {text}
                </a>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <span
                    style={{ color: status === "logged_in" ? "red" : "green" }}
                >
                    {status === "logged_in" ? "In use" : "Available"}
                </span>
            ),
        },
        {
            title: "Time",
            dataIndex: "timestamp",
            key: "timestamp",
        },
        {
            title: "User",
            dataIndex: "user",
            key: "user",
        },
    ];

    useEffect(() => {
        const fetchStatus = () => {
            fetch(API_URL)
                .then((data) => data.json())
                .then((data) =>
                    setComputers(
                        data.sort((a, b) =>
                            a.computer.localeCompare(b.computer)
                        )
                    )
                )
                .catch((error) => console.error("Error fetching data:", error));
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <Table
                columns={columns}
                dataSource={computers}
                bordered={true}
                style={{ margin: "20px" }}
            />

            {/* Pop-up Modal for Computer Info */}
            <Modal
                title="Computer Details"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                {selected && (
                    <div>
                        <p>
                            <strong>Computer:</strong> {selected.computer}
                        </p>
                        <p>
                            <strong>Status:</strong> {selected.status}
                        </p>
                        <p>
                            <strong>Timestamp:</strong> {selected.timestamp}
                        </p>
                        <p>
                            <strong>User:</strong> {selected.user}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default StatusTable;
