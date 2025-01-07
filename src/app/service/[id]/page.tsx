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
  Checkbox,
} from "antd";
import type { CheckboxProps } from "antd";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import axiosInstance from "@/hooks/axios";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthContext";
const { Title } = Typography;

interface ServiceInfo {
  ezemshigchiin_ner: string;
  turul: string;
  description?: string;
  createdat?: string;
  updatedat?: string;
  categoryid: number;
  status: boolean;
}

export default function Page() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo>({
    ezemshigchiin_ner: "",
    turul: "",
    description: "",
    categoryid: Number(id) || 1,
    status: false,
  });
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };
  const fetchService = async () => {
    try {
      setLoading(true);
      const serviceId = id ? id : "add";
      const response = await axiosInstance.get(`/service/${serviceId}`);
      const serviceData = response.data?.data?.service || {};
      serviceId === id && setIsChecked(response.data?.data?.service?.status);
      if (serviceData.createdat) {
        serviceData.createdat = dayjs(serviceData.createdat);
      }
      setServiceInfo(serviceData);
      form.setFieldsValue(serviceData);
      const allCategories = response.data?.data?.category?.records || [];

      console.log(allCategories);
      const childCategories = allCategories.filter((cat: any) => {
        const hasChildren = allCategories.some(
          (c: any) => c.parentid === cat.id
        );
        return !hasChildren;
      });

      console.log("childCategories", childCategories);

      setCategories(childCategories);
    } catch (err: any) {
      console.log("---Үйлчилгээний мэдээлэл татахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        ...serviceInfo,
        ...values,
        status: isChecked,
      };
      const serviceId = id ? id : "add";
      const endpoint = `/service/${serviceId}`;
      const method = id ? "put" : "put";

      await axiosInstance[method](endpoint, payload);
      message.success(
        `Үйлчилгээ амжилттай ${id ? "шинэчлэгдлээ" : "үүсгэгдлээ"}`
      );
      router.push("/service");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Үйлчилгээ хадгалахад алдаа гарлаа";
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
          {id ? "Үйлчилгээ засах" : "Шинэ үйлчилгээ"}
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={serviceInfo}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Эзэмшигчийн нэр"
                name="ezemshigchiin_ner"
                rules={[
                  { required: true, message: "Эзэмшигчийн нэрийг оруулна уу!" },
                ]}
              >
                <Input placeholder="Эзэмшигчийн нэр" />
              </Form.Item>

              <Form.Item
                label="Төрөл"
                name="turul"
                rules={[{ required: true, message: "Төрлийг оруулна уу!" }]}
              >
                <Input placeholder="Төрөл" />
              </Form.Item>

              <Form.Item label="Тайлбар" name="description">
                <Input.TextArea rows={4} placeholder="Тайлбар" />
              </Form.Item>

              <Form.Item
                label="Алба хэлтэс"
                name="categoryid"
                rules={[{ required: true, message: "Алба хэлтэс!" }]}
              >
                <select
                  className="w-full border p-2 rounded-md"
                  name="categoryid"
                  id="categoryid"
                >
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Form.Item>
              <Form.Item>
                <label>
                  <input
                    className="p-2 bordew-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <span className=" font-semibold mx-2 pb-2">
                    Үйлчилгээ авсан эсэх
                  </span>
                </label>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => router.back()}>
              <Space>
                <RollbackOutlined /> Буцах
              </Space>
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              <Space>
                <SaveOutlined /> Хадгалах
              </Space>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
