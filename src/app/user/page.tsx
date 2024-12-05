"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/hooks/axios";
import { getUsers } from "@/app/state/get";
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
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { ChangeEvent, DragEvent } from "react";
import type { SortOrder } from "antd/es/table/interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
const { Content } = Layout;
const { Title } = Typography;

export interface ProductInfo {
  email: string;
  password: string;
  name: string;
}

export interface Product extends ProductInfo {
  id: number;
  createdat: string;
  updatedat: string;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export default function Home() {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleDeleteProduct = async (id: number) => {
    if (!isAdmin) {
      message.error("Админ эрх шаардлагатай");
      return;
    }
    try {
      const confirmed = window.confirm(
        "Та энэ бүртгэлийг устгахдаа итгэлтэй байна уу?"
      );
      if (!confirmed) return;
      await axiosInstance.delete(`/user/${id}`);
      fetchProducts();
      message.success("Бүртгэл амжилттай устгагдлаа");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Бүртгэл устгахад алдаа гарлаа";
      message.error(errorMsg);
    }
  };

  const fetchProducts = async (
    currentPage: number = page,
    currentPageSize: number = pageSize
  ) => {
    try {
      setIsLoading(true);
      const res = await getUsers({
        page: currentPage,
        perPage: currentPageSize,
        ...filters,
      });
      if (res?.data) {
        setProducts(res.data.data.records);
        setTotal(res.data.data.total);
        setPage(currentPage);
        setPageSize(currentPageSize);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.data.message ||
        err.message ||
        "Бүртгэл татахад алдаа гарлаа";
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    fetchProducts(pagination.current, pagination.pageSize);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const columns = [
    {
      title: "И-мэйл",
      dataIndex: "email",
      key: "email",
      filterDropdown: () => (
        <Input
          placeholder="Хайх"
          onChange={(e) => handleFilterChange("email", e.target.value)}
          value={filters.email}
        />
      ),
    },
    {
      title: "Нэр",
      dataIndex: "name", 
      key: "name",
      filterDropdown: () => (
        <Input
          placeholder="Хайх"
          onChange={(e) => handleFilterChange("name", e.target.value)}
          value={filters.name}
        />
      ),
    },
    {
      title: "Үүсгэсэн огноо",
      dataIndex: "createdat",
      key: "createdat",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Product, b: Product) =>
        new Date(a.createdat).getTime() - new Date(b.createdat).getTime(),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    isAdmin
      ? {
          title: "Үйлдэл",
          key: "actions",
          render: (_: unknown, record: Product) => (
            <div className="flex gap-2">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteProduct(record.id)}
              >
                Устгах
              </Button>
              <Link href={`/user/${record.id}`}>
                <Button type="primary" icon={<EditOutlined />}>
                  Засах
                </Button>
              </Link>
            </div>
          ),
        }
      : null,
  ].filter((col): col is any => col !== null);

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
            <Title level={4}>Бүртгэл</Title>
            {isAdmin && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push("/user/new")}
              >
                Шинэ бүртгэл
              </Button>
            )}
          </div>

          <div className="space-y-2" style={{ marginBottom: 4 }}>
            <Input
              placeholder="И-мэйл"
              style={{ width: 200, marginRight: 8 }}
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
            />
            <Input
              placeholder="Нэр"
              style={{ width: 200, marginRight: 8 }}
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
            />
          </div>

          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
            }}
            loading={isLoading}
            onChange={handleTableChange}
            scroll={{ x: true }}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
