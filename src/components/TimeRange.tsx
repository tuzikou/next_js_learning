'use client'

import { useState } from 'react';

interface MonthsResponse {
  monthStarts: string[];
}

export default function TimeRange() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [monthStarts, setMonthStarts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchMonths = async () => {
    if (!startTime || !endTime) {
      setError('请选择开始和结束时间');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Format dates to YYYY-MM
      const from = startTime.substring(0, 7);
      const to = endTime.substring(0, 7);

      // Example coordinates for Shanghai
      const lon = '121.469170';
      const lat = '31.224361';

      const response = await fetch(
        `/api/months?lon=${lon}&lat=${lat}&from=${from}&to=${to}`
      );

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data: MonthsResponse = await response.json();
      setMonthStarts(data.monthStarts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求出错');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">本地时间区间选择</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="w-24">开始时间：</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-24">结束时间：</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleFetchMonths}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white transition-colors ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? '加载中...' : '获取月份开始时间'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {monthStarts.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">月份开始时间（UTC）：</h3>
            <div className="space-y-1">
              {monthStarts.map((time, index) => (
                <div key={index} className="text-gray-700">
                  {time}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
