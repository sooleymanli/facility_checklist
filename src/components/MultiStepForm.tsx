import React, { useState } from 'react';
import { DatePicker, Select, Form, Input, Button } from 'antd';

const MultiStepForm: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomData, setRoomData] = useState({});
    const [allRoomsData, setAllRoomsData] = useState([]);

    const floors = ['1st Floor', '2nd Floor', '3rd Floor'];
    const rooms = {
        '1st Floor': ['Room 101', 'Room 102'],
        '2nd Floor': ['Room 201', 'Room 202'],
        '3rd Floor': ['Room 301', 'Room 302']
    };

    const handleSaveRoomData = () => {
        if (selectedRoom && roomData[selectedRoom]) {
            setAllRoomsData([...allRoomsData, { room: selectedRoom, data: roomData[selectedRoom] }]);
            setSelectedRoom(null);
            setRoomData({});
        }
    };

    const handleSaveAllData = () => {
        console.log('All Data:', allRoomsData);
        // Add logic to save all data
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Multi-Step Form</h2>

            <Form layout="vertical">
                <Form.Item label="Select Date">
                    <DatePicker onChange={(date) => setSelectedDate(date)} />
                </Form.Item>

                {selectedDate && (
                    <Form.Item label="Select Floor">
                        <Select
                            placeholder="Select a floor"
                            onChange={(value) => setSelectedFloor(value)}
                        >
                            {floors.map((floor) => (
                                <Select.Option key={floor} value={floor}>
                                    {floor}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                {selectedFloor && (
                    <Form.Item label="Select Room">
                        <Select
                            placeholder="Select a room"
                            onChange={(value) => setSelectedRoom(value)}
                        >
                            {rooms[selectedFloor].map((room) => (
                                <Select.Option key={room} value={room}>
                                    {room}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                {selectedRoom && (
                    <Form.Item label={`Enter Data for ${selectedRoom}`}>
                        <Input
                            placeholder="Enter data"
                            value={roomData[selectedRoom] || ''}
                            onChange={(e) => setRoomData({ ...roomData, [selectedRoom]: e.target.value })}
                        />
                        <Button onClick={handleSaveRoomData} style={{ marginTop: 10 }}>
                            Save Room Data
                        </Button>
                    </Form.Item>
                )}

                {allRoomsData.length > 0 && (
                    <Button type="primary" onClick={handleSaveAllData} style={{ marginTop: 20 }}>
                        Save All Data
                    </Button>
                )}
            </Form>
        </div>
    );
};

export default MultiStepForm;