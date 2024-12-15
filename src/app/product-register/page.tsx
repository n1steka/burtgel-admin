"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/hooks/axios";
import { getProduct } from "@/app/state/get";
import {
  Table,
  Tag,
  Button,
  Input,
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
  ezemshigchiin_ner: string;
  endDate: Date | null;
  Pc_mark: string;
  cpu: string;
  ram: string;
  hhp: string;
  mac_addres: string;
  printer: string;
  description?: string;
  bar_code: string;
  categoryid: number;
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
    categoryId: undefined,
    ezemshigchiin_ner: "",
    Pc_mark: "",
    cpu: "",
    ram: "",
    hhp: "",
    mac_addres: "",
    printer: "",
    bar_code: "",
    endDate: null as Date | null,
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
      await axiosInstance.delete(`/product/${id}`);
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
      const res = await getProduct({
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
      title: "Эзэмшигчийн нэр",
      dataIndex: "ezemshigchiin_ner",
      key: "ezemshigchiin_ner",
      filterDropdown: () => (
        <Input
          placeholder="Хайх"
          onChange={(e) =>
            handleFilterChange("ezemshigchiin_ner", e.target.value)
          }
          value={filters.ezemshigchiin_ner}
        />
      ),
    },
    {
      title: "Дуусах хугацаа",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => {
        if (!date) return "-";
        const endDate = new Date(date);
        const now = new Date();
        const isExpired = endDate <= now;

        return (
          <span style={{ color: isExpired ? "red" : "inherit" }}>
            {endDate.toLocaleDateString()}
          </span>
        );
      },
      filterDropdown: () => (
        <DatePicker
          onChange={(date) =>
            handleFilterChange("endDate", date?.toDate() || null)
          }
        />
      ),
    },
    {
      title: "Компьютерийн марк",
      dataIndex: "Pc_mark",
      key: "Pc_mark",
      filterDropdown: () => (
        <Input
          placeholder="Хайх"
          onChange={(e) => handleFilterChange("Pc_mark", e.target.value)}
          value={filters.Pc_mark}
        />
      ),
    },
    {
      title: "CPU",
      dataIndex: "cpu",
      key: "cpu",
      filterDropdown: () => (
        <Input
          placeholder="Хайх"
          onChange={(e) => handleFilterChange("cpu", e.target.value)}
          value={filters.cpu}
        />
      ),
    },
    {
      title: "RAM",
      dataIndex: "ram",
      key: "ram",
      filterDropdown: () => (
        <Input
          placeholder="Хайх"
          onChange={(e) => handleFilterChange("ram", e.target.value)}
          value={filters.ram}
        />
      ),
    },
    {
      title: "HHP",
      dataIndex: "hhp",
      key: "hhp",
      filterDropdown: () => (
        <Input
          placeholder="Хайх"
          onChange={(e) => handleFilterChange("hhp", e.target.value)}
          value={filters.hhp}
        />
      ),
    },
    {
      title: "MAC хаяг",
      dataIndex: "mac_addres",
      key: "mac_addres",
      filterDropdown: () => (
        <Input
          placeholder="Хайх"
          onChange={(e) => handleFilterChange("mac_addres", e.target.value)}
          value={filters.mac_addres}
        />
      ),
    },
    {
      title: "Принтер",
      dataIndex: "printer",
      key: "printer",
      filterDropdown: () => (
        <Input
          placeholder="Хайх"
          onChange={(e) => handleFilterChange("printer", e.target.value)}
          value={filters.printer}
        />
      ),
    },
    {
      title: "Бар код",
      dataIndex: "bar_code",
      key: "bar_code",
      filterDropdown: () => (
        <Input
          placeholder="Хайх"
          onChange={(e) => handleFilterChange("bar_code", e.target.value)}
          value={filters.bar_code}
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
              <Link href={`/product-register/${record.id}`}>
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
                onClick={() => router.push("/product-register/add")}
              >
                Шинэ бүртгэл
              </Button>
            )}
          </div>

          <div className=" space-y-2" style={{ marginBottom: 4 }}>
            <Input
              placeholder="Эзэмшигчийн нэр"
              style={{ width: 200, marginRight: 8 }}
              value={filters.ezemshigchiin_ner}
              onChange={(e) =>
                handleFilterChange("ezemshigchiin_ner", e.target.value)
              }
            />
            <Input
              placeholder="Компьютерийн марк"
              style={{ width: 200, marginRight: 8 }}
              value={filters.Pc_mark}
              onChange={(e) => handleFilterChange("Pc_mark", e.target.value)}
            />
            <Input
              placeholder="CPU"
              style={{ width: 200, marginRight: 8 }}
              value={filters.cpu}
              onChange={(e) => handleFilterChange("cpu", e.target.value)}
            />
            <Input
              placeholder="RAM"
              style={{ width: 200, marginRight: 8 }}
              value={filters.ram}
              onChange={(e) => handleFilterChange("ram", e.target.value)}
            />
            <Input
              placeholder="HHP"
              style={{ width: 200, marginRight: 8 }}
              value={filters.hhp}
              onChange={(e) => handleFilterChange("hhp", e.target.value)}
            />
            <Input
              placeholder="MAC хаяг"
              style={{ width: 200, marginRight: 8 }}
              value={filters.mac_addres}
              onChange={(e) => handleFilterChange("mac_addres", e.target.value)}
            />
            <Input
              placeholder="Принтер"
              style={{ width: 200, marginRight: 8 }}
              value={filters.printer}
              onChange={(e) => handleFilterChange("printer", e.target.value)}
            />
            <Input
              placeholder="Бар код"
              style={{ width: 200, marginRight: 8 }}
              value={filters.bar_code}
              onChange={(e) => handleFilterChange("bar_code", e.target.value)}
            />
            <DatePicker
              placeholder="Дуусах хугацаа"
              style={{ width: 200 }}
              onChange={(date) =>
                handleFilterChange("endDate", date?.toDate() || null)
              }
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
