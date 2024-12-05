"use client";
import React, { useState, ChangeEvent, DragEvent, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Switch,
  Modal,
  Form,
  Layout,
  DatePicker,
  Typography,
  message,
  Row,
  Col,
  Card,
  Space,
  Spin,
  Select,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  SaveOutlined,
  RollbackOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import type { SortOrder } from "antd/es/table/interface";
import type { ProductInfo } from "@/app/product-register/page";
import axiosInstance from "@/hooks/axios";
import { useParams, useRouter } from "next/navigation";

const { Title } = Typography;

interface ProductMedia {
  position: number;
  url: string;
}

interface ProductProperty {
  value: string;
  unit: string;
}

export default function ProductPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productMedias, setProductMedias] = useState<ProductMedia[]>([]);
  const [productProperties, setProductProperties] = useState<ProductProperty[]>(
    []
  );
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

  const defaultProperties = [
    { value: "", unit: "" },
  ];

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/product/${id}`);
      const productData = response.data.data.product || {};
      setProductInfo(productData);
      setProductMedias(productData.medias || []);
      setProductProperties(productData.properties || defaultProperties);
      form.setFieldsValue({
        ...productData,
        properties: productData.properties || defaultProperties,
      });
      setCategories(response.data.data.category.records || []);
    } catch (err: any) {
      console.log("Бүтээгдэхүүний мэдээлэл татахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    } else {
      form.setFieldsValue({
        properties: defaultProperties,
      });
    }
  }, [id]);

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

  const handleMediaFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file, index) => {
        if (file.size > 10 * 1024 * 1024) {
          message.error(`${file.name} хэмжээ 10MB-с бага байх ёстой`);
          return;
        }
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (reader.readyState === 2) {
            setProductMedias((prev) => [
              ...prev,
              {
                position: prev.length + 1,
                url: (event.target?.result as string) || "",
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
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

  const handleMediaDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file, index) => {
        if (file.size > 5 * 1024 * 1024) {
          message.error(`${file.name} хэмжээ 5MB-с бага байх ёстой`);
          return;
        }
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (reader.readyState === 2) {
            setProductMedias((prev) => [
              ...prev,
              {
                position: prev.length + 1,
                url: (event.target?.result as string) || "",
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveMedia = (position: number) => {
    setProductMedias((prev) =>
      prev.filter((media) => media.position !== position)
    );
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        ...productInfo,
        ...values,
        product_medias: productMedias,
        product_properties: values.properties.map((prop: any) => ({
          value: prop.value,
          unit: prop.unit,
        })),
      };

      const endpoint = id ? `/product/${id}` : "/product";
      const method = id ? "put" : "post";

      await axiosInstance[method](endpoint, payload);
      message.success(
        `Бүтээгдэхүүн амжилттай ${id ? "шинэчлэгдлээ" : "үүсгэгдлээ"}`
      );
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <Title level={4} className="mb-6">
          {id !== "add" ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн"}
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
                  {categories.map((category: any) => (
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

              <Form.List name="properties">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Row gutter={16} key={field.key}>
                        <Col span={10}>
                          <Form.Item {...field} name={[field.name, "value"]}>
                            <Input placeholder="Утга оруулах" />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item {...field} name={[field.name, "unit"]}>
                            <Input placeholder="Нэгж оруулах" />
                          </Form.Item>
                        </Col>
                        <Col span={4} className="flex items-center">
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Шинж чанар нэмэх
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>

            <Col span={12}>
              <Form.Item label="Үндсэн зураг">
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

              <Form.Item label="Нэмэлт зургууд">
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleMediaDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="media-upload"
                    onChange={handleMediaFileChange}
                    multiple
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <div className="text-gray-500">
                      <UploadOutlined className="text-2xl mb-2" />
                      <p>Нэмэлт зургууд оруулах эсвэл чирж оруулах</p>
                    </div>
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {productMedias.map((media, index) => (
                    <div key={index} className="relative">
                      <img
                        src={media.url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveMedia(media.position)}
                      />
                    </div>
                  ))}
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
