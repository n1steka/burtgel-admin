import { Checkbox, Modal } from "antd";
import { FunctionComponent } from "react";

import type { CheckboxProps } from "antd";
interface UpadteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleOk: () => void;
  confirmLoading: boolean;
  record?: any;
}

const UpadteModal: FunctionComponent<UpadteModalProps> = ({
  open,
  setOpen,
  handleOk,
  confirmLoading,
  record,
}) => {
  const handleCancel = () => {
    setOpen(false);
  };
  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  return (
    <Modal
      title="Баталгаажуулалт"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okText="Батлах"
      cancelText="Хаах"
      okButtonProps={{
        style: {
          backgroundColor: "#4caf50",
          borderColor: "#4caf50",
          color: "#fff",
        },
      }}
      cancelButtonProps={{
        style: {
          backgroundColor: "#f44336",
          borderColor: "#f44336",
          color: "#fff",
        },
      }}
    >
      <Checkbox onChange={onChange}> is block </Checkbox>
      <p>{record?.isSent ? "Mark as Not Sent?" : "Mark as Sent?"}</p>
    </Modal>
  );
};

export default UpadteModal;
