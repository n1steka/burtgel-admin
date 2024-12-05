"use client";
import React, { useState, ChangeEvent, DragEvent, useEffect } from "react";
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
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
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
    name: "",
    description: "",
    shortdescription: "",
    unitprice: 0,
    saleprice: 0,
    stock: 0,
    weight: 0,
    status: "идэвхтэй",
    hasdelivery: true,
    isactive: true,
    isdraft: false,
    sellemptystock: false,
    isspecial: false,
    specialstartdate: null,
    specialenddate: null,
    rate: 5,
    backgroundimageurl: "",
    brandid: 1,
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

  const handleFileChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        message.error("Зургийн хэмжээ 5MB-с бага байх ёстой");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (reader.readyState === 2) {
          setProductInfo((prev) => ({
            ...prev,
            backgroundimageurl: (event.target?.result as string) || "",
          }));
          form.setFieldValue("backgroundimageurl", event.target?.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        message.error("Зургийн хэмжээ 5MB-с бага байх ёстой");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (reader.readyState === 2) {
          setProductInfo((prev) => ({
            ...prev,
            backgroundimageurl: (event.target?.result as string) || "",
          }));
          form.setFieldValue("backgroundimageurl", event.target?.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        ...productInfo,
        ...values,
      };

      // if (!payload.name || !payload.unitprice || !payload.stock) {
      //   message.error("Шаардлагатай талбаруудыг бөглөнө үү!");
      //   return;
      // }

      await axiosInstance.post("/product", payload);
      message.success("Бүтээгдэхүүн амжилттай үүсгэгдлээ");
      router.push("/product-register");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Бүтээгдэхүүн хадгалахад алдаа гарлаа";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <Title level={4} className="mb-6">
          Шинэ бүтээгдэхүүн
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
                label="Нэр"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Бүтээгдэхүүний нэрийг оруулна уу!",
                  },
                ]}
              >
                <Input placeholder="Бүтээгдэхүүний нэрийг оруулах" />
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

              <Form.Item label="Дэлгэрэнгүй тайлбар" name="description">
                <Input.TextArea
                  rows={4}
                  placeholder="Дэлгэрэнгүй тайлбар оруулах"
                />
              </Form.Item>

              <Form.Item label="Товч тайлбар" name="shortdescription">
                <Input.TextArea rows={2} placeholder="Товч тайлбар оруулах" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Нэгж үнэ"
                    name="unitprice"
                    rules={[{ required: true, message: "Үнэ оруулна уу!" }]}
                  >
                    <Input type="number" min={0} step={0.01} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Хямдралтай үнэ" name="saleprice">
                    <Input type="number" min={0} step={0.01} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={12}>
              <Form.Item label="Зураг">
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={handleFileChangeImage}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {productInfo.backgroundimageurl ? (
                      <img
                        src={productInfo.backgroundimageurl}
                        alt="Preview"
                        className="max-h-40 mx-auto mb-4"
                      />
                    ) : (
                      <div className="text-gray-500">
                        <UploadOutlined className="text-2xl mb-2" />
                        <p>Зураг оруулах эсвэл чирж оруулах</p>
                      </div>
                    )}
                  </label>
                </div>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Үлдэгдэл"
                    name="stock"
                    rules={[
                      { required: true, message: "Үлдэгдэл оруулна уу!" },
                    ]}
                  >
                    <Input type="number" min={0} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Жин" name="weight">
                    <Input type="number" min={0} step={0.1} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Хүргэлттэй эсэх"
                    name="hasdelivery"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Идэвхтэй"
                    name="isactive"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Ноорог"
                    name="isdraft"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Дууссан бараа зарах"
                    name="sellemptystock"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Онцгой"
                name="isspecial"
                valuePropName="checked"
              >
                <Switch />
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
