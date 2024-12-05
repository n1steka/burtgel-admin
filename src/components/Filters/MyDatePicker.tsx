import React from "react";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
interface Props {
  setDate: (value: string) => void;
  text: string;
}

const MyDatePicker: React.FC<Props> = ({ setDate, text }) => {
  const onChange: DatePickerProps["onChange"] = (date, dateString: any) => {
    setDate(dateString);
    console.log(dateString);
  };

  return (
    <Space>
      <DatePicker placeholder={text} onChange={onChange} />
    </Space>
  );
};

export default MyDatePicker;
