"use client";
import React from "react";
import { useEffect, useState } from "react";
import axiosInstance from "@/hooks/axios";
import { DatePicker, Input, Table } from "antd";
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ProductStats {
  totalProducts: number;
  productsAddedToday: number;
}

interface ExpiredProduct {
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
}

interface DailyStats {
  date: string;
  count: number;
}

interface GraphData {
  dailyNew: DailyStats[];
  dailyExpiring: DailyStats[];
  dateRange: string[];
}

export default function Page() {
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    productsAddedToday: 0
  });
  const [expiredProducts, setExpiredProducts] = useState<ExpiredProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    name: "",
    startDate: null,
    endDate: null,
    page: 1,
    pageSize: 10
  });
  const [total, setTotal] = useState(0);
  const [graphData, setGraphData] = useState<GraphData>({
    dailyNew: [],
    dailyExpiring: [],
    dateRange: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {
          page: filters.page.toString(),
          pageSize: filters.pageSize.toString()
        };
        if (filters.name) params.name = filters.name;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;

        const [statsResponse, expiredResponse, graphResponse] = await Promise.all([
          axiosInstance.get('/totalProducts'),
          axiosInstance.get(`/endProducts?${new URLSearchParams(params)}`),
          axiosInstance.get('/graphProducts')
        ]);

        setGraphData(graphResponse.data.data);
        setExpiredProducts(expiredResponse.data.data.products);
        setTotal(expiredResponse.data.data.total);

        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
          setError(null);
        }
      } catch (error) {
        console.error('Бүтээгдэхүүний статистик авахад алдаа гарлаа:', error);
        setError('Бүтээгдэхүүний статистикийг ачаалж чадсангүй. Дара дахин оролдоно уу.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filters]);

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  const columns = [
    {
      title: 'Эзэмшигчийн нэр',
      dataIndex: 'ezemshigchiin_ner',
      key: 'ezemshigchiin_ner',
      sorter: (a: ExpiredProduct, b: ExpiredProduct) => 
        a.ezemshigchiin_ner.localeCompare(b.ezemshigchiin_ner)
    },
    {
      title: 'Компьютерийн марк',
      dataIndex: 'Pc_mark',
      key: 'Pc_mark',
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      key: 'cpu',
    },
    {
      title: 'RAM',
      dataIndex: 'ram',
      key: 'ram',
    },
    {
      title: 'Дуусах хугацаа',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: ExpiredProduct, b: ExpiredProduct) => 
        new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    },
  ];

  const combinedChartOptions = {
    chart: {
      type: 'line' as const,
      height: 350
    },
    xaxis: {
      type: 'datetime' as const,
      categories: graphData.dateRange,
      title: {
        text: 'Огноо'
      }
    },
    yaxis: {
      title: {
        text: 'Бүтээгдэхүүний тоо'
      }
    },
    title: {
      text: 'Бүтээгдэхүүний статистик',
      align: 'center' as const
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd'
      }
    }
  };

  const combinedSeries = [
    {
      name: 'Шинэ бүтээгдэхүүн',
      data: graphData.dailyNew.map(item => item.count)
    },
    {
      name: 'Дуусах хугацаатай бүтээгдэхүүн',
      data: graphData.dailyExpiring.map(item => item.count)
    }
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Бүтээгдэхүүний Статистик</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl text-gray-600 mb-2">Нийт Бүтээгдэхүүн</h2>
          <p className="text-4xl font-bold text-blue-600">{stats.totalProducts}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl text-gray-600 mb-2">Өнөөдөр Нэмэгдсэн Бүтээгдэхүүн</h2>
          <p className="text-4xl font-bold text-green-600">{stats.productsAddedToday}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <Chart 
          options={combinedChartOptions}
          series={combinedSeries}
          type="line"
          height={350}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Хугацаа Дууссан Бүтээгдэхүүнүүд</h2>
        
        <div className="mb-4 flex gap-4 flex-wrap">
          <Input
            placeholder="Эзэмшигчийн нэр"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            style={{ width: 200 }}
          />
          <DatePicker.RangePicker
            onChange={(dates) => {
              handleFilterChange('startDate', dates?.[0]?.toISOString());
              handleFilterChange('endDate', dates?.[1]?.toISOString());
            }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={expiredProducts}
          rowKey="id"
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: total,
            onChange: (page, pageSize) => {
              setFilters(prev => ({
                ...prev,
                page,
                pageSize: pageSize || 10
              }));
            }
          }}
          loading={loading}
        />
      </div>
    </div>
  );
}
