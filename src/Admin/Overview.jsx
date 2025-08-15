import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Overview = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/enrollments/history") // server route
      .then((res) => {
        console.log("Raw API data:", res.data);

        // filter paid payments
        const paidPayments = res.data.filter(
          (p) => p.paymentStatus === "paid"
        );

        // map to chart format
        const payments = paidPayments.map((p) => ({
          date: new Date(p.enrolledAt).toLocaleDateString(),
          amount: p.price,
        }));

        // same date এ amount যোগ করা
        const grouped = payments.reduce((acc, curr) => {
          const existing = acc.find((d) => d.date === curr.date);
          if (existing) existing.amount += curr.amount;
          else acc.push({ date: curr.date, amount: curr.amount });
          return acc;
        }, []);

        setChartData(grouped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Axios error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-300">
        Loading payment chart...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 md:p-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          💰 All Students Payments
        </h2>
        <span className="text-gray-500 dark:text-gray-300 text-sm">
          Updated today
        </span>
      </div>

      {chartData.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-300 text-center py-20">
          No payment data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tick={{ fill: "#9ca3af" }} />
            <YAxis tick={{ fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Overview;
