import React, { useState, useEffect } from "react";
import Timeline, {
    TimelineMarkers,
    TodayMarker,
} from "react-calendar-timeline";
import moment from "moment";
import "react-calendar-timeline/dist/style.css";
import { DatePicker, Card, Input, Select, Button, Modal } from "antd";
import { UserOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;

function Scheduler() {
    const [name, setName] = useState("");
    const [computers, setComputers] = useState([]);
    const [selectedDay, setSelectedDay] = useState(moment());
    const [selectedRange, setSelectedRange] = useState(null);
    const [selectedComputer, setSelectedComputer] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [formattedReservations, setFormattedReservations] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    function fetchReservations() {
        fetch(
            "https://status-monitor-backend-284b10dff973.herokuapp.com/get-reservations",
            {
                method: "GET",
                headers: { "Content-Type": "application/json; charset=utf-8" },
            }
        )
            .then((response) => response.json())
            .then((reservations) => {
                const temp = [];

                let numOfReservations = 0;
                for (let i = 0; i < reservations.length; i++) {
                    if (!reservations[i]["reservations"]) {
                        continue;
                    }
                    for (
                        let j = 0;
                        j < reservations[i]["reservations"].length;
                        j++
                    ) {
                        numOfReservations++;
                        temp.push({
                            id: Number(reservations[i]["computer"] + j),
                            group: reservations[i]["computer"],
                            title: reservations[i]["reservations"][j]["name"],
                            start_time: moment(
                                reservations[i]["reservations"][j]["start_time"]
                            ),
                            end_time: moment(
                                reservations[i]["reservations"][j]["end_time"]
                            ),
                        });
                    }
                }

                setFormattedReservations(temp);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }
    // get the list of computers
    useEffect(() => {
        fetch(
            "https://status-monitor-backend-284b10dff973.herokuapp.com/computerlist",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                const formattedComputers = data.map((computer) => ({
                    id: computer,
                    title: `${computer}`,
                }));
                setComputers(formattedComputers);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        fetchReservations();
    }, []);

    function submitTask() {
        if (
            !name ||
            !selectedComputer ||
            !selectedRange ||
            selectedRange.length < 2
        ) {
            alert("All fields are required!");
            return;
        }

        fetch(
            "https://status-monitor-backend-284b10dff973.herokuapp.com/reserve",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    name: name,
                    computer: selectedComputer,
                    start_time: selectedRange[0].toISOString(),
                    end_time: selectedRange[1].toISOString(),
                }),
            }
        )
            .then(() => {
                setModalVisible(false);
                fetchReservations();
            })
            .catch((error) => {
                console.error("Error creating task:", error);
            });
    }

    return (
        <div>
            <Card
                title="Schedule"
                style={{
                    padding: "20px",
                    maxWidth: "90%",
                    margin: "auto",
                }}
            >
                <div style={{ textAlign: "right" }}>
                    <Button
                        variant="outlined"
                        color="default"
                        style={{
                            float: "left",
                            width: "40px",
                        }}
                        onClick={() =>
                            setSelectedDay(selectedDay.clone().subtract(1, "d"))
                        }
                    >
                        <LeftOutlined />
                    </Button>
                    <Button
                        variant="outlined"
                        color="default"
                        style={{
                            float: "left",
                            marginLeft: "20px",
                            width: "40px",
                        }}
                        onClick={() =>
                            setSelectedDay(selectedDay.clone().add(1, "d"))
                        }
                    >
                        <RightOutlined />
                    </Button>
                    <Button
                        variant="outlined"
                        color="default"
                        onClick={() => setModalVisible(true)}
                        style={{
                            marginBottom: "20px",
                            marginRight: "20px",
                            alignContent: "center",
                            width: "80px",
                        }}
                    >
                        New
                    </Button>
                    <Button
                        variant="outlined"
                        color="danger"
                        style={{
                            marginBottom: "20px",
                            marginRight: "20px",
                            alignContent: "center",
                            width: "80px",
                        }}
                        onClick={() => {
                            if (selectedTask) {
                                fetch(
                                    "https://status-monitor-backend-284b10dff973.herokuapp.com/delete-reservation",
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type":
                                                "application/json; charset=utf-8",
                                        },
                                        body: JSON.stringify({
                                            id: selectedTask,
                                        }),
                                    }
                                )
                                    .then(() => {
                                        fetchReservations();
                                    })
                                    .catch((error) => {
                                        console.error(
                                            "Error deleting task:",
                                            error
                                        );
                                    });
                            }
                        }}
                    >
                        Delete
                    </Button>
                </div>

                <Modal
                    title="Schedule new task"
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    style={{ textAlign: "center" }}
                >
                    <div>
                        <Input
                            placeholder="Please input your name"
                            prefix={<UserOutlined />}
                            style={{
                                width: "80%",
                                marginBottom: "20px",
                                marginTop: "20px",
                            }}
                            onChange={(value) => setName(value.target.value)}
                        />
                    </div>
                    <div>
                        <Select
                            placeholder="Select a computer"
                            style={{
                                width: "80%",
                                marginBottom: "20px",
                                textAlign: "left",
                            }}
                            onChange={(value) => setSelectedComputer(value)}
                        >
                            {computers.map((computer) => (
                                <Select.Option
                                    key={computer["id"]}
                                    value={computer["id"]}
                                >
                                    {computer["id"]}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <RangePicker
                            showTime={true}
                            style={{
                                width: "80%",
                                marginBottom: "20px",
                                textAlign: "left",
                            }}
                            onChange={(date) => setSelectedRange(date)}
                        />
                    </div>
                    <Button type="primary" onClick={submitTask}>
                        Create Task
                    </Button>
                </Modal>

                <Timeline
                    groups={computers}
                    items={formattedReservations}
                    visibleTimeStart={moment(selectedDay).startOf("day")}
                    visibleTimeEnd={moment(selectedDay).endOf("day")}
                    lineHeight={30}
                    itemHeightRatio={0.75}
                    traditionalZoom={true}
                    canMove={true}
                    canSelect={true}
                    onItemSelect={(itemId) => setSelectedTask(itemId)}
                    onItemDeselect={() => setSelectedTask(null)}
                >
                    <TimelineMarkers>
                        <TodayMarker />
                    </TimelineMarkers>
                </Timeline>
            </Card>
        </div>
    );
}

export default Scheduler;
