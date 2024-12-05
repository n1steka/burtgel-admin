import React, { useState } from "react";
import axios from "axios";
function TimeInputExample() {
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");

  const handleOpenTimeChange = (event: any) => {
    setOpenTime(event.target.value);
    console.log(event.target.value);
  };

  const handleCloseTimeChange = (event: any) => {
    setCloseTime(event.target.value);
    console.log(event.target.value);
  };
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjY2MGJiYmY2OTlhMzFhYmEwN2RjNmZjYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzEyMDQ1MjAxLCJleHAiOjE3MTQ2MzcyMDF9.5lv-paAcKL1SD3kqM_xMXpI_l9_rb9jFV6XvwjCU-G0";
  const click = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/service",
        {
          name: "pedikur",
          description: "asdas",
          SubCategory: "660bac04ce686a6723994d7e",
          open: openTime,
          close: closeTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:----------------", response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <label htmlFor="openTime">Open Time:</label>
      <input
        type="time"
        id="openTime"
        name="openTime"
        value={openTime}
        onChange={handleOpenTimeChange}
      />
      <br />
      <label htmlFor="closeTime">Close Time:</label>
      <input
        type="time"
        id="closeTime"
        name="closeTime"
        value={closeTime}
        onChange={handleCloseTimeChange}
      />
      <button className="p-2 bg-blue-600" onClick={click}>
        save
      </button>
    </div>
  );
}

export default TimeInputExample;
