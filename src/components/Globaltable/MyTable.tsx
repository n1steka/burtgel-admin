import { Table } from "antd";
import { FunctionComponent } from "react";

interface MyTableProps {
  data: any[];
  columns: any[];
  page?: any;
  pageSize?: any;
  loading: boolean;
  total?: any;
  setRecord?: (value: any) => void;
  handleTableChange: (pagination: any) => void;
}

const MyTable: FunctionComponent<MyTableProps> = ({
  data,
  columns,
  page,
  pageSize,
  loading,
  total,
  setRecord,
  handleTableChange,
}) => {
  const handleRowClick = (record: any) => {
    if (setRecord) {
      setRecord(record);
    }
  };

  return (
    <div>
      <Table
        rowClassName={() => "editable-row"}
        size="small"
        dataSource={data}
        columns={columns}
        rowKey="id"
        onRow={(record) => {
          return {
            onClick: () => {
              handleRowClick(record);
            },
          };
        }}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
        }}
        loading={loading}
        onChange={handleTableChange}
        locale={{
          emptyText: loading ? "Loading..." : "No data found",
        }}
      />
    </div>
  );
};

export default MyTable;
