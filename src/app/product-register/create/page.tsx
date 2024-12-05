"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Switch,
  Form,
  Typography,
  message,
  Row,
  Col,
  Card,
  Space,
  Select,
  DatePicker,
} from "antd";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import type { ProductInfo } from "@/app/product-register/page";
import axiosInstance from "@/hooks/axios";
import { useRouter } from "next/navigation";

const { Title } = Typography;

interface Category {
  id: number;
  name: string;
}

export default function ProductPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    ezemshigchiin_ner: "",
    endDate: null,
    Pc_mark: "",
    cpu: "",
    ram: "",
    hhp: "",
    mac_addres: "",
    printer: "",
    description: "",
    bar_code: "",
    categoryid: 1,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/allcategorys");
        if (response?.data?.records) {
          setCategories(response.data.records);
        }
      } catch (err: any) {
        message.error("Ангилал татахад алдаа гарлаа");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        ...productInfo,
        ...values,
      };

      await axiosInstance.post("/product", payload);
      message.success("Бүртгэл амжилттай үүсгэгдлээ");
      router.push("/product-register");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Бүртгэл хадгалахад алдаа гарлаа";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <Title level={4} className="mb-6">
          Шинэ бүртгэл
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={productInfo}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Эзэмшигчийн нэр"
                name="ezemshigchiin_ner"
                rules={[
                  {
                    required: true,
                    message: "Эзэмшигчийн нэрийг оруулна уу!",
                  },
                ]}
              >
                <Input placeholder="Эзэмшигчийн нэрийг оруулах" />
              </Form.Item>

              <Form.Item label="Дуусах хугацаа" name="endDate">
                <DatePicker showTime />
              </Form.Item>

              <Form.Item
                label="Компьютерийн марк"
                name="Pc_mark"
                rules={[
                  {
                    required: true,
                    message: "Компьютерийн маркийг оруулна уу!",
                  },
                ]}
              >
                <Input placeholder="Компьютерийн маркийг оруулах" />
              </Form.Item>

              <Form.Item
                label="CPU"
                name="cpu"
                rules={[
                  {
                    required: true,
                    message: "CPU оруулна уу!",
                  },
                ]}
              >
                <Input placeholder="CPU оруулах" />
              </Form.Item>

              <Form.Item
                label="RAM"
                name="ram"
                rules={[
                  {
                    required: true,
                    message: "RAM оруулна уу!",
                  },
                ]}
              >
                <Input placeholder="RAM оруулах" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="HHP"
                name="hhp"
                rules={[
                  {
                    required: true,
                    message: "HHP оруулна уу!",
                  },
                ]}
              >
                <Input placeholder="HHP оруулах" />
              </Form.Item>

              <Form.Item
                label="MAC хаяг"
                name="mac_addres"
                rules={[
                  {
                    required: true,
                    message: "MAC хаягийг оруулна уу!",
                  },
                ]}
              >
                <Input placeholder="MAC хаягийг оруулах" />
              </Form.Item>

              <Form.Item
                label="Принтер"
                name="printer"
                rules={[
                  {
                    required: true,
                    message: "Принтерийг оруулна уу!",
                  },
                ]}
              >
                <Input placeholder="Принтерийг оруулах" />
              </Form.Item>

              <Form.Item
                label="Бар код"
                name="bar_code"
                rules={[
                  {
                    required: true,
                    message: "Бар кодыг оруулна уу!",
                  },
                ]}
              >
                <Input placeholder="Бар кодыг оруулах" />
              </Form.Item>

              <Form.Item
                label="Ангилал"
                name="categoryid"
                rules={[
                  {
                    required: true,
                    message: "Ангилал сонгоно уу!",
                  },
                ]}
              >
                <Select placeholder="Ангилал сонгох">
                  {categories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Тайлбар" name="description">
                <Input.TextArea rows={4} placeholder="Тайлбар оруулах" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => router.push("/product-register")}>
              <Space>
                <RollbackOutlined />
                Буцах
              </Space>
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
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
