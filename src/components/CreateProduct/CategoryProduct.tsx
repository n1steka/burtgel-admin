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
import type { ProductInfo } from "@/app/product-register/page";
import axiosInstance from "@/hooks/axios";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthContext";
const { Title } = Typography;

interface CategoryProductProps {
  id?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  isCategory?: boolean;
}

export const CategoryProduct: React.FC<CategoryProductProps> = ({
  id,
  onSuccess,
  onCancel,
  isCategory,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
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
    categoryid: id || 1,
  });

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const proId = isCategory === false ? id : "add";
      const response = await axiosInstance.get(`/product/${proId}`);
      const productData = response.data?.data?.product || {};

      if (productData.endDate) {
        productData.endDate = dayjs(productData.endDate);
      }
      setProductInfo(productData);
      form.setFieldsValue(productData);
      const allCategories = response.data?.data?.category?.records || [];
      const childCategories = allCategories.filter((cat: any) => {
        const hasChildren = allCategories.some(
          (c: any) => c.parentid === cat.id
        );
        return !hasChildren;
      });
      const defaultCategory = childCategories.find((cat: any) => cat.id === id);
      setCategories(childCategories);
    } catch (err: any) {
      console.log("Бүтээгдэхүүний мэдээлэл татахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      // if (!isAdmin) {
      //   message.error("Админ эрх шаардлагатай");
      //   router.push("/product-register");
      //   return;
      // }
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        ...productInfo,
        ...values,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      };
      const proId = isCategory === false ? id : "add";
      const endpoint = `/product/${proId}`;
      const method = "put";

      await axiosInstance[method](endpoint, payload);
      message.success(
        `Бүртгэл амжилттай ${id ? "шинэчлэгдлээ" : "үүсгэгдлээ"}`
      );
      onSuccess?.();
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
          {id ? "Бүртгэл засах" : "Шинэ бүртгэл"}
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={productInfo}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
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
                <DatePicker className="w-full" />
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

            <Col xs={24} sm={24} md={12}>
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

              <Form.Item label="Тайлбар" name="description">
                <Input.TextArea rows={4} placeholder="Тайлбар оруулах" />
              </Form.Item>

              <Form.Item
                label="Бар код заавал оруулах шаардлагаггүй автоматаар үүсгэгдэнэ"
                name="bar_code"
                // rules={[
                //   {
                //     required: true,
                //     message: "Бар кодыг оруулна уу!",
                //   },
                // ]}
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
                <Select
                  placeholder="Ангилал сонгох"
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => {
                    const label = String(option?.label || "");
                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {categories.map((category: any) => (
                    <Select.Option
                      key={category.id}
                      value={category.id}
                      label={`${category.id}. ${category.name}`}
                    >
                      {category.id}. {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4 sm:mt-6">
            <Button
              className="w-full sm:w-auto"
              onClick={onCancel || (() => router.back())}
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
};
