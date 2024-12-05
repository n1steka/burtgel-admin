"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Form,
  Typography,
  message,
  Row,
  Col,
  Card,
  Space,
  Spin,
  DatePicker,
  Select,
} from "antd";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import axiosInstance from "@/hooks/axios";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthContext";
const { Title } = Typography;

export default function UserPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    name: ""
  });

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/${id}`);
      const userData = response.data.data || {};
      setUserInfo(userData);
      form.setFieldsValue(userData);
    } catch (err: any) {
      console.log("Хэрэглэгчийн мэдээлэл татахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      if (!isAdmin) {
        message.error("Админ эрх шаардлагатай");
        router.push("/");
        return;
      }
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        ...userInfo,
        ...values
      };

      const endpoint = id ? `/create/ter/${id}` : "/create/ter";
      const method = id ? "put" : "post";

      await axiosInstance[method](endpoint, payload);
      message.success(
        `Хэрэглэгч амжилттай ${id ? "шинэчлэгдлээ" : "үүсгэгдлээ"}`
      );
      router.push("/user");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Хэрэглэгч хадгалахад алдаа гарлаа";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <Card>
        <Title level={4} className="mb-4 sm:mb-6">
          {id !== "add" ? "Хэрэглэгч засах" : "Шинэ хэрэглэгч"}
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={userInfo}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="И-мэйл"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "И-мэйл хаягаа оруулна уу!",
                  },
                  {
                    type: "email",
                    message: "Зөв и-мэйл хаяг оруулна уу!"
                  }
                ]}
              >
                <Input placeholder="И-мэйл хаяг оруулах" />
              </Form.Item>

              <Form.Item
                label="Нууц үг"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Нууц үгээ оруулна уу!",
                  }
                ]}
              >
                <Input.Password placeholder="Нууц үг оруулах" />
              </Form.Item>

              <Form.Item
                label="Нэр"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Нэрээ оруулна уу!",
                  }
                ]}
              >
                <Input placeholder="Нэр оруулах" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4 sm:mt-6">
            <Button
              className="w-full sm:w-auto"
              onClick={() => router.push("/user")}
            >
              <Space>
                <RollbackOutlined />
                Буцах
              </Space>
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full sm:w-auto"
            >
              <Space>
                <SaveOutlined />
                Хадгалах
              </Space>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
