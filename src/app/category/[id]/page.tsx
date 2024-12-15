"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProduct } from "@/app/state/get";
import { Button, Table, Input, DatePicker, message } from "antd";
import { useRouter } from "next/navigation";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { SortOrder } from "antd/es/table/interface";
import { Link } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/axios";
import JsBarcode from "jsbarcode";

interface Product {
  id: number;
  ezemshigchiin_ner: string;
  endDate: string;
  Pc_mark: string;
  cpu: string;
  ram: string;
  hhp: string;
  mac_addres: string;
  printer: string;
  description: string;
  bar_code: string;
  createdat: string;
  updatedat: string;
  categoryid: number;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    isactive: boolean;
    parentid: number;
    createdat: string;
    updatedat: string;
  };
}

// Separate component for barcode rendering
const BarcodeCell = ({ barCode }: { barCode: string }) => {
  useEffect(() => {
    if (barCode) {
      JsBarcode(`#barcode-${barCode}`, barCode, {
        format: "CODE128",
        width: 1,
        height: 30,
        displayValue: true,
      });
    }
  }, [barCode]);

  return barCode ? <svg id={`barcode-${barCode}`}></svg> : null;
};

export default function CategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const { isAdmin } = useAuth();

  const [filters, setFilters] = useState({
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

  const fetchProducts = async () => {
    try {
      const response: any = await getProduct({
        categoryId: id,
        page,
        perPage: pageSize,
        ...filters,
      });
      setProducts(response.data.data.records);
      setTotal(response.data.data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id, page, pageSize, filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
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
      render: (barCode: string) => <BarcodeCell barCode={barCode} />,
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
          title: "Устгах",
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
            </div>
          ),
        }
      : null,
    isAdmin
      ? {
          title: "Засах",
          key: "actions",
          render: (_: unknown, record: Product) => (
            <div className="flex gap-2">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => router.push(`/product-register/${record.id}`)}
              >
                Засах
              </Button>
            </div>
          ),
        }
      : null,
  ].filter((col): col is any => col !== null);
  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push(`/category/categoryProduct/${id}`)}
          className="flex justify-end mb-4 hover:scale-105 transition-transform duration-200 gap-2"
        >
          <span>Шинэ бүртгэл</span>
        </Button>
      </div>
      <div className="space-y-2" style={{ marginBottom: 4 }}>
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
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
}
