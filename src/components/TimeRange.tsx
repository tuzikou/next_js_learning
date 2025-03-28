'use client'

import { useState } from 'react';

interface MonthsResponse {
  monthStarts: string[];
}

interface Coordinates {
  lon: string;
  lat: string;
}

const SHANGHAI_COORDINATES: Coordinates = {
  lon: '121.469170',
  lat: '31.224361',
};

export default function TimeRange() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [longitude, setLongitude] = useState(SHANGHAI_COORDINATES.lon);
  const [latitude, setLatitude] = useState(SHANGHAI_COORDINATES.lat);
  const [monthStarts, setMonthStarts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchMonths = async () => {
    if (!startTime || !endTime) {
      setError('请选择开始和结束时间');
      return;
    }

    if (startTime > endTime) {
      setError('开始时间不能晚于结束时间');
      return;
    }

    if (!longitude || !latitude) {
      setError('请输入有效的经纬度');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        lon: longitude,
        lat: latitude,
        from: startTime,
        to: endTime,
      });

      const response = await fetch(`/api/months?${queryParams}`);

      if (!response.ok) {
        throw new Error(`请求失败: ${response.statusText}`);
      }

      const data: MonthsResponse = await response.json();
      setMonthStarts(data.monthStarts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求出错');
    } finally {
      setLoading(false);
    }
  };

  const renderTimeInput = (
    label: string,
    value: string,
    onChange: (value: string) => void
  ) => (
    <div className="flex items-center gap-4">
      <label className="w-24">{label}</label>
      <input
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const renderCoordinateInput = (
    label: string,
    value: string,
    onChange: (value: string) => void
  ) => (
    <div className="flex items-center gap-4">
      <label className="w-24">{label}</label>
      <input
        type="number"
        step="0.000001"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">本地时间区间选择</h2>
      <div className="space-y-4">
        {renderTimeInput('开始时间：', startTime, setStartTime)}
        {renderTimeInput('结束时间：', endTime, setEndTime)}
        
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">位置信息</h3>
          {renderCoordinateInput('经度：', longitude, setLongitude)}
          {renderCoordinateInput('纬度：', latitude, setLatitude)}
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
