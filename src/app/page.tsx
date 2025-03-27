'use client'

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import TimeRange from '@/components/TimeRange';
import ComplexForm from '@/components/ComplexForm';
import DraggableCards from '@/components/DraggableCards';

export default function Home() {
  const [activeTab, setActiveTab] = useState('time');

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex space-x-1 bg-white p-1 rounded-lg mb-6">
            <Tabs.Trigger
              value="time"
              className={`flex-1 py-3 px-4 rounded-md transition-colors ${
                activeTab === 'time'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              本地时间区间
            </Tabs.Trigger>
            <Tabs.Trigger
              value="form"
              className={`flex-1 py-3 px-4 rounded-md transition-colors ${
                activeTab === 'form'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              复杂表单
            </Tabs.Trigger>
            <Tabs.Trigger
              value="cards"
              className={`flex-1 py-3 px-4 rounded-md transition-colors ${
                activeTab === 'cards'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              卡片拖拽
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="time">
            <TimeRange />
          </Tabs.Content>

          <Tabs.Content value="form">
            <ComplexForm />
          </Tabs.Content>

          <Tabs.Content value="cards">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <DraggableCards />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </main>
  );
}
