"use client";
import { useEffect, useState } from "react";
import { getServices, getCategories } from "@/app/state/get";
import { Button, Table, Input, Select, message, DatePicker } from "antd";
import { useRouter } from "next/navigation";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { SortOrder } from "antd/es/table/interface";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/axios";
import dayjs from "dayjs";

interface Service {
  id: number;
  ezemshigchiin_ner: string;
  turul: string;
  description?: string;
  createdat: string;
  updatedat: string;
  categoryid: number;
  status: boolean;
  category: {
    id: number;
    name: string;
    description: string;
    isactive: boolean;
    createdat: string;
    updatedat: string;
  };
}

interface Category {
  id: number;
  name: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  console.log(services);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const { isAdmin } = useAuth();

  const [filters, setFilters] = useState({
    ezemshigchiin_ner: "",
    turul: "",
    description: "",
    categoryId: "",
    createdat: "",
    status: false,
  });

  const fetchServices = async () => {
    try {
      const response: any = await getServices({
        page,
        perPage: pageSize,
        ...filters,
      });
      setServices(response.data.data.records);
      setTotal(response.data.data.total);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response: any = await getCategories();
      setCategories(response.data.records);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDeleteService = async (id: number) => {
    if (!isAdmin) {
      message.error("Админ эрх шаардлагатай");
      return;
    }
    try {
      const confirmed = window.confirm(
        "Та энэ бүртгэлийг устгахдаа итгэлтэй байна уу?"
      );
      if (!confirmed) return;
      await axiosInstance.delete(`/service/${id}`);
      fetchServices();
      message.success("Бүртгэл амжилттай устгагдлаа");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Бүртгэл устгахад алдаа гарлаа";
      message.error(errorMsg);
    }
  };

  const columns: any = [
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
      title: "Төрөл",
      dataIndex: "turul",
      key: "turul",
      filterDropdown: () => (
        <Input
          placeholder="Хайх"
          onChange={(e) => handleFilterChange("turul", e.target.value)}
          value={filters.turul}
        />
      ),
    },
    {
      title: "Ангилал",
      dataIndex: "categoryid",
      key: "categoryid",
      render: (categoryId: number) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Тодорхойгүй";
      },
      filterDropdown: () => (
        <Select
          placeholder="Ангилал сонгох"
          onChange={(value) => handleFilterChange("categoryId", value)}
          value={filters.categoryId || undefined}
          style={{ width: "100%" }}
          allowClear
        >
          {categories.map((cat) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Үүсгэсэн огноо",
      dataIndex: "createdat",
      key: "createdat",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Service, b: Service) =>
        new Date(a.createdat).getTime() - new Date(b.createdat).getTime(),
      sortDirections: ["ascend", "descend"] as SortOrder[],
      filterDropdown: () => (
        <DatePicker
          style={{ width: "100%" }}
          onChange={(date) =>
            handleFilterChange(
              "createdat",
              date ? dayjs(date).format("YYYY-MM-DD") : ""
            )
          }
          value={filters.createdat ? dayjs(filters.createdat) : null}
          allowClear
        />
      ),
    },

    {
      title: "Үйлчилгээ авсан эсэх",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <span
          className={`${
            status
              ? "text-green-500 font-semibold"
              : "text-red-500 font-semibold"
          }`}
        >
          {status ? "Тийм" : "Үгүй"}
        </span>
      ),
    },

    isAdmin && {
      title: "Устгах",
      key: "actions",
      render: (_: unknown, record: Service) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteService(record.id)}
        >
          Устгах
        </Button>
      ),
    },
    isAdmin && {
      title: "Засах",
      key: "actions",
      render: (_: unknown, record: Service) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => router.push(`/service/${record.id}`)}
        >
          Засах
        </Button>
      ),
    },
  ].filter(Boolean);

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/service/add")}
          className="hover:scale-105 transition-transform duration-200"
        >
          <span>Шинэ бүртгэл</span>
        </Button>
      </div>
      <div className="flex gap-4 my-4">
        <Input
          placeholder="Эзэмшигчийн нэр"
          value={filters.ezemshigchiin_ner}
          onChange={(e) =>
            handleFilterChange("ezemshigchiin_ner", e.target.value)
          }
        />
        <Select
          placeholder="Ангилал сонгох"
          value={filters.categoryId || undefined}
          onChange={(value) => handleFilterChange("categoryId", value)}
          style={{ width: "200px" }}
          allowClear
        >
          {categories.map((cat) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>
        <DatePicker
          placeholder="Огноо сонгох"
          onChange={(date) =>
            handleFilterChange(
              "createdat",
              date ? dayjs(date).format("YYYY-MM-DD") : ""
            )
          }
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={services}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
}
