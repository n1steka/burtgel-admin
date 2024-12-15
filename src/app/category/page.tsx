"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/hooks/axios";
import Link from "next/link";
import {
  Tag,
  Button,
  Input,
  Switch,
  Modal,
  Form,
  Layout,
  Menu,
  Typography,
  message,
  List,
  Space,
  Card,
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
const { Sider, Content } = Layout;
const { Title } = Typography;

interface CategoryInfo {
  name: string;
  slug: string;
  description: string;
  isactive: boolean;
  parentid: number | null;
}

interface Category extends CategoryInfo {
  id: number;
  createdat: string;
  updatedat: string;
}

interface MainCategory {
  id: number;
  name: string;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export default function Home() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<MainCategory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo>({
    name: "",
    slug: "",
    description: "",
    isactive: true,
    parentid: null,
  });

  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleCreateCategory = async () => {
    try {
      const values = await form.validateFields();
      const parentId = selectedMainCategory?.id || null;

      const payload: CategoryInfo = {
        ...values,
        ...categoryInfo,
        parentid: parentId,
        name: values.name || "",
        description: values.description || "",
        isactive: values.isactive || true,
        slug: values.slug || "",
      };

      if (parentId === null) {
        await axiosInstance.post("/category", payload);
      } else {
        await axiosInstance.post("/category", payload);
      }

      fetchCategories();
      setIsModalOpen(false);
      form.resetFields();
      setCategoryInfo({
        name: "",
        slug: "",
        description: "",
        isactive: true,
        parentid: null,
      });
      message.success("Category created successfully");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create category";
      message.error(errorMsg);
    }
  };

  const handleEditCategory = async () => {
    try {
      const values = await form.validateFields();
      const parentId = selectedMainCategory?.id || null;

      const payload: CategoryInfo = {
        ...values,
        ...categoryInfo,
        parentid: parentId,
        name: values.name || "",
        description: values.description || "",
        isactive: values.isactive || true,
        slug: values.slug || "",
      };

      if (editingCategory) {
        if (editingCategory.parentid === null) {
          await axiosInstance.put(`/category/${editingCategory.id}`, {
            ...payload,
            parentid: null,
          });
        } else {
          await axiosInstance.put(`/category/${editingCategory.id}`, payload);
        }
        message.success("Category updated successfully");
      }

      fetchCategories();
      setIsEditModalOpen(false);
      form.resetFields();
      setEditingCategory(null);
      setCategoryInfo({
        name: "",
        slug: "",
        description: "",
        isactive: true,
        parentid: null,
      });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update category";
      message.error(errorMsg);
    }
  };

  const handleDeleteCategory = async (
    id: number,
    isMainCategory: boolean = false
  ) => {
    try {
      if (isMainCategory) {
        await axiosInstance.delete(`/category/${id}`);
      } else {
        await axiosInstance.delete(`/category/${id}`);
      }
      fetchCategories();
      message.success("Category deleted successfully");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete category";
      message.error(errorMsg);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const mainCategoriesResponse = await axiosInstance.get("/maincategorys");
      setMainCategories(mainCategoriesResponse.data.records);

      if (mainCategoriesResponse.data.records.length > 0) {
        const firstMainCategory = mainCategoriesResponse.data.records[0];
        setSelectedMainCategory(firstMainCategory);
        const childCategoriesResponse = await axiosInstance.get(
          `/categorys?parentid=${firstMainCategory.id}`
        );
        setCategories(childCategoriesResponse.data.records);
        setPagination((prev) => ({
          ...prev,
          total: childCategoriesResponse.data.total,
        }));
      } else {
        setCategories([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
        }));
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch categories";
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMainCategoryClick = async (mainCategory: MainCategory) => {
    setSelectedMainCategory(mainCategory);
    try {
      const childCategoriesResponse = await axiosInstance.get(
        `/categorys?parentid=${mainCategory.id}`
      );
      setCategories(childCategoriesResponse.data.records);
      setPagination((prev) => ({
        ...prev,
        total: childCategoriesResponse.data.total,
      }));
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch categories";
      message.error(errorMsg);
    }
  };

  const handleEditClick = (record: Category) => {
    setEditingCategory(record);
    setCategoryInfo({
      name: record.name,
      slug: record.slug,
      description: record.description,
      isactive: record.isactive,
      parentid: record.parentid,
    });
    form.setFieldsValue(record);
    setIsEditModalOpen(true);
  };

  const { isAdmin } = useAuth();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} theme="light">
        <div style={{ padding: 12 }}>
          <Title level={5}>Байгууллага</Title>
          {isAdmin && (
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              className="mb-3 w-full"
              onClick={() => {
                setSelectedMainCategory(null);
                setIsModalOpen(true);
              }}
            >
              Нэмэх
            </Button>
          )}
          <div className="flex flex-col">
            {mainCategories.map((item) => (
              <Card
                size="small"
                key={item.id}
                className={`folder-card mb-2 ${
                  selectedMainCategory?.id === item.id ? "selected" : ""
                }`}
                onClick={() => handleMainCategoryClick(item)}
                hoverable
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedMainCategory?.id === item.id ? "#f0f0f0" : "white",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FolderOutlined
                      style={{ fontSize: 16, marginRight: 6, color: "#1890ff" }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  {isAdmin && (
                    <Space size={2}>
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick({
                            ...item,
                            parentid: null,
                          } as Category);
                        }}
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(item.id, true);
                        }}
                      />
                    </Space>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Sider>

      <Layout>
        <Content style={{ padding: 14 }}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={5}>
              {selectedMainCategory ? selectedMainCategory.name : "Categories"}
            </Title>
            {isAdmin && selectedMainCategory && (
              <Button
                size="small"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                Алба хэлтэс
              </Button>
            )}
          </div>

          <Row gutter={[12, 12]}>
            {categories.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  size="small"
                  hoverable
                  className="folder-item"
                  actions={
                    isAdmin
                      ? [
                          <Button
                            key="edit"
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEditClick(item)}
                          />,
                          <Button
                            key="delete"
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              handleDeleteCategory(
                                item.id,
                                item.parentid === null
                              )
                            }
                          />,
                        ]
                      : []
                  }
                >
                  <Link href={`/category/${item.id}`}>
                    <Card.Meta
                      avatar={
                        <FolderOutlined
                          style={{ fontSize: 24, color: "#1890ff" }}
                        />
                      }
                      title={item.name}
                      description={item.description}
                    />
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
          <Modal
            title={
              selectedMainCategory ? "Add New Category" : "Add Main Category"
            }
            open={isModalOpen}
            onOk={handleCreateCategory}
            onCancel={() => setIsModalOpen(false)}
            width={400}
            okText="Create"
            cancelText="Cancel"
          >
            <Form
              form={form}
              layout="vertical"
              size="small"
              initialValues={categoryInfo}
              onFinish={handleCreateCategory}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please input category name!" },
                ]}
              >
                <Input placeholder="Enter category name" />
              </Form.Item>

              <Form.Item label="Slug" name="slug">
                <Input placeholder="Enter category slug" />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input.TextArea placeholder="Enter category description" />
              </Form.Item>

              <Form.Item label="Active" name="isactive" valuePropName="checked">
                <Switch size="small" />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Edit Category"
            open={isEditModalOpen}
            onOk={handleEditCategory}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingCategory(null);
              form.resetFields();
            }}
            width={400}
            okText="Save"
            cancelText="Cancel"
          >
            <Form
              form={form}
              layout="vertical"
              size="small"
              initialValues={categoryInfo}
              onFinish={handleEditCategory}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please input category name!" },
                ]}
              >
                <Input placeholder="Enter category name" />
              </Form.Item>

              <Form.Item label="Slug" name="slug">
                <Input placeholder="Enter category slug" />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input.TextArea placeholder="Enter category description" />
              </Form.Item>

              <Form.Item label="Active" name="isactive" valuePropName="checked">
                <Switch size="small" />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}
