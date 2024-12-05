"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/hooks/axios";
import { getOrders } from "@/app/state/get";
import { Table, Tag, Button, Layout, Typography, message, Modal } from "antd";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  unitprice: string;
  backgroundimageurl: string;
}

interface Order {
  id: number;
  amount: string;
  is_paid: boolean;
  items: OrderItem[];
  user_id: number;
  createdat: string;
  phone: string | null;
  description: string | null;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchOrders = async (
    currentPage: number = page,
    currentPageSize: number = pageSize
  ) => {
    try {
      setIsLoading(true);
      const res = await getOrders({
        page: currentPage,
        perPage: currentPageSize,
      });
      if (res?.data) {
        setOrders(res.data.records);
        setTotal(res.data.total);
        setPage(currentPage);
        setPageSize(currentPageSize);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Захиалга татахад алдаа гарлаа";
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    fetchOrders(pagination.current, pagination.pageSize);
  };

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Захиалгын ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Захиалагч",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string | null) => phone || "Дугаар оруулаагүй",
    },
    {
      title: "Захиалсан бараа",
      dataIndex: "items",
      key: "items",
      render: (items: OrderItem[]) => (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <img
                src={item.backgroundimageurl}
                alt={item.name}
                className="w-10 h-10 object-cover rounded"
              />
              <div>
                <div>{item.name}</div>
                <div className="text-gray-500">
                  {item.quantity}x {Number(item.unitprice).toLocaleString()}₮
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Нийт дүн",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => `${Number(amount).toLocaleString()}₮`,
    },
    {
      title: "Төлбөр",
      dataIndex: "is_paid",
      key: "is_paid",
      render: (isPaid: boolean) => (
        <Tag color={isPaid ? "success" : "error"}>
          {isPaid ? "Төлсөн" : "Төлөөгүй"}
        </Tag>
      ),
    },
    {
      title: "Огноо",
      dataIndex: "createdat",
      key: "createdat",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Үйлдэл",
      key: "action",
      render: (_: any, record: Order) => (
        <Button type="link" onClick={() => showOrderDetail(record)}>
          Дэлгэрэнгүй
        </Button>
      ),
    },
  ];

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
            <Title level={4}>Захиалгууд</Title>
          </div>

          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
            }}
            loading={isLoading}
            onChange={handleTableChange}
          />

          <Modal
            title={`Захиалгын дэлгэрэнгүй #${selectedOrder?.id}`}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={800}
          >
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Захиалагч:</p>
                    <p>{selectedOrder.phone || "Дугаар оруулаагүй"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Захиалгын огноо:</p>
                    <p>{new Date(selectedOrder.createdat).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Төлбөрийн төлөв:</p>
                    <Tag color={selectedOrder.is_paid ? "success" : "error"}>
                      {selectedOrder.is_paid ? "Төлсөн" : "Төлөөгүй"}
                    </Tag>
                  </div>
                  <div>
                    <p className="font-semibold">Нийт дүн:</p>
                    <p>{Number(selectedOrder.amount).toLocaleString()}₮</p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-2">Захиалсан бараанууд:</p>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border p-4 rounded"
                      >
                        <img
                          src={item.backgroundimageurl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-grow">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-500">
                            Тоо ширхэг: {item.quantity}
                          </p>
                          <p className="text-gray-500">
                            Нэгж үнэ: {Number(item.unitprice).toLocaleString()}₮
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {(
                              Number(item.unitprice) * item.quantity
                            ).toLocaleString()}
                            ₮
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.description && (
                  <div>
                    <p className="font-semibold">Тэмдэглэл:</p>
                    <p>{selectedOrder.description}</p>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}
