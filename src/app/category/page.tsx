"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/hooks/axios";
import {
  Table,
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
} from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import type { SortOrder } from "antd/es/table/interface";
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
        // Creating main category
        await axiosInstance.post("/category", payload);
      } else {
        // Creating sub-category
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
          // Editing main category
          await axiosInstance.put(`/category/${editingCategory.id}`, {
            ...payload,
            parentid: null,
          });
        } else {
          // Editing sub-category
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "isactive",
      key: "isactive",
      render: (isactive: boolean) => (
        <Tag color={isactive ? "success" : "error"}>
          {isactive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdat",
      key: "createdat",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Category, b: Category) =>
        new Date(a.createdat).getTime() - new Date(b.createdat).getTime(),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Updated At",
      dataIndex: "updatedat",
      key: "updatedat",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Category, b: Category) =>
        new Date(a.updatedat).getTime() - new Date(b.updatedat).getTime(),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Category) => (
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEditClick(record)}
              >
                Edit
              </Button>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() =>
                  handleDeleteCategory(record.id, record.parentid === null)
                }
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const { isAdmin } = useAuth();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={300} theme="light">
        <div style={{ padding: 16 }}>
          <Title level={5}>Байгууллага</Title>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="mb-2"
              onClick={() => {
                setSelectedMainCategory(null);
                setIsModalOpen(true);
              }}
            >
              Нэмэх
            </Button>
          )}
          <Menu
            mode="vertical"
            selectedKeys={[selectedMainCategory?.id?.toString() ?? ""]}
          >
            {mainCategories.map((item) => (
              <Menu.Item
                key={item.id}
                onClick={() => handleMainCategoryClick(item)}
              >
                <span className="text-sm">{item.name}</span>
                {isAdmin && (
                  <>
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
                  </>
                )}
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </Sider>

      <Layout>
        <Content style={{ padding: 24 }}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4}>
              {selectedMainCategory ? selectedMainCategory.name : "Categories"}
            </Title>
            {isAdmin && selectedMainCategory && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                Алба хэлтэс
              </Button>
            )}
          </div>

          <Table
            columns={columns}
            dataSource={categories}
            rowKey="id"
            pagination={pagination}
            loading={isLoading}
          />

          <Modal
            title={
              selectedMainCategory ? "Add New Category" : "Add Main Category"
            }
            open={isModalOpen}
            onOk={handleCreateCategory}
            onCancel={() => setIsModalOpen(false)}
            width={600}
            okText="Create"
            cancelText="Cancel"
          >
            <Form
              form={form}
              layout="vertical"
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
                <Switch />
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
            width={600}
            okText="Save"
            cancelText="Cancel"
          >
            <Form
              form={form}
              layout="vertical"
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
                <Switch />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}
