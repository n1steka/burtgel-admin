"use client";
import React from "react";
import { Input, Space } from "antd";
const { Search } = Input;

interface MyFilterProps {
  text?: string;
  searchText?: string;
  onSearch?: (value: any) => void;
  setSearchText?: (value: any) => void;
}

const MyFilter: React.FC<MyFilterProps> = ({
  text,
  searchText,
  onSearch,
  setSearchText,
}) => {
  return (
    <div className="my-4">
      <Space direction="vertical" size="middle">
        <Space.Compact>
          <Search
            placeholder={text}
            allowClear
            value={searchText}
            onSearch={onSearch}
            onChange={(e) => setSearchText?.(e.target.value)}
          />
        </Space.Compact>
      </Space>
    </div>
  );
};

export default MyFilter;
