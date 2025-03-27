"use client";

import { useState, useCallback } from 'react';

interface Task {
  id: string;
  title: string;
}

interface Column {
  id: 'left' | 'right';
  tasks: Task[];
}

export default function DraggableCards() {
  // 初始化左右两栏数据
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'left',
      tasks: [
        { id: 'task-a', title: 'Task A' },
        { id: 'task-b', title: 'Task B' },
        { id: 'task-c', title: 'Task C' },
      ],
    },
    {
      id: 'right',
      tasks: [
        { id: 'task-d', title: 'Task D' },
        { id: 'task-e', title: 'Task E' },
      ],
    },
  ]);

  // 当前拖拽的任务ID
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  // 拖拽目标位置
  const [dropTarget, setDropTarget] = useState<{columnId: string, index: number} | null>(null);
  // 拖拽元素的高度
  const [draggedHeight, setDraggedHeight] = useState<number>(0);

  // 开始拖拽
  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    const element = e.currentTarget as HTMLElement;
    setDraggedHeight(element.offsetHeight);
    setDraggedTask(taskId);
    e.dataTransfer.setDragImage(element, 0, 0);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // 拖拽悬停在卡片上
  const handleDragOver = useCallback((e: React.DragEvent, columnId: string, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 如果没有正在拖拽的任务，直接返回
    if (!draggedTask) return;
    
    const targetElement = e.currentTarget as HTMLElement;
    const rect = targetElement.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // 根据鼠标位置决定是放在当前元素上方还是下方
    if (mouseY < rect.height / 2) {
      setDropTarget({ columnId, index });
    } else {
      setDropTarget({ columnId, index: index + 1 });
    }
  }, [draggedTask]);

  // 拖拽悬停在列容器上
  const handleColumnDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedTask) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // 找到当前列
    const column = columns.find(col => col.id === columnId);
    if (!column) return;
    
    // 如果鼠标位置超过所有卡片，则放置在列表末尾
    if (mouseY > (column.tasks.length * (draggedHeight + 16))) {
      setDropTarget({ columnId, index: column.tasks.length });
    }
  }, [draggedTask, columns, draggedHeight]);

  // 结束拖拽
  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDropTarget(null);
    setDraggedHeight(0);
  }, []);

  // 放置卡片
  const handleDrop = useCallback((e: React.DragEvent, targetColumnId: string, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTask) return;

    // 使用 dropTarget 中的 index，如果存在的话
    const finalTargetIndex = dropTarget && dropTarget.columnId === targetColumnId 
      ? dropTarget.index 
      : targetIndex;

    setColumns(prevColumns => {
      const sourceColumn = prevColumns.find(col => 
        col.tasks.some(task => task.id === draggedTask)
      );
      const sourceColumnIndex = prevColumns.findIndex(col => 
        col.tasks.some(task => task.id === draggedTask)
      );
      const targetColumnIndex = prevColumns.findIndex(col => col.id === targetColumnId);
      
      if (!sourceColumn || sourceColumnIndex === -1 || targetColumnIndex === -1) return prevColumns;

      const sourceTaskIndex = sourceColumn.tasks.findIndex(task => task.id === draggedTask);
      const newColumns = [...prevColumns];

      // 获取源任务和目标位置
      const sourceTask = sourceColumn.tasks[sourceTaskIndex];
      const targetColumn = newColumns[targetColumnIndex];

      // 创建新的任务数组，保持原有顺序
      const newSourceTasks = [...sourceColumn.tasks];
      const newTargetTasks = sourceColumnIndex === targetColumnIndex 
        ? newSourceTasks 
        : [...targetColumn.tasks];

      // 如果是同一列内移动
      if (sourceColumnIndex === targetColumnIndex) {
        // 移动任务到新位置
        newSourceTasks.splice(sourceTaskIndex, 1);
        newSourceTasks.splice(finalTargetIndex > sourceTaskIndex ? finalTargetIndex - 1 : finalTargetIndex, 0, sourceTask);
        newColumns[sourceColumnIndex].tasks = newSourceTasks;
      } else {
        // 跨列移动
        newSourceTasks.splice(sourceTaskIndex, 1);
        newTargetTasks.splice(finalTargetIndex, 0, sourceTask);
        newColumns[sourceColumnIndex].tasks = newSourceTasks;
        newColumns[targetColumnIndex].tasks = newTargetTasks;
      }

      return newColumns;
    });

    handleDragEnd();
  }, [draggedTask, handleDragEnd, dropTarget]);
  
  return (
    <div className="flex gap-16 p-16 min-h-screen">
      {columns.map(column => (
        <div 
          key={column.id}
          className="flex-1"
          onDragOver={(e) => handleColumnDragOver(e, column.id)}
          onDrop={(e) => handleDrop(e, column.id, column.tasks.length)}
        >
          <div className="space-y-4">
            {column.tasks.map((task, index) => {
              // Find the source task's position
              const sourceColumn = columns.find(col => 
                col.tasks.some(t => t.id === draggedTask)
              );
              const sourceIndex = sourceColumn?.tasks.findIndex(t => t.id === draggedTask);
              const isSourcePosition = sourceColumn?.id === column.id && sourceIndex === index;

              return (
                <div key={task.id} className="relative">
                  {/* 拖拽预览指示器 - 虚线框样式 */}
                  {dropTarget?.columnId === column.id && 
                   dropTarget.index === index && 
                   !isSourcePosition && (
                    <div 
                      style={{ height: `${draggedHeight}px` }}
                      className="border-2 border-dashed border-blue-400 rounded-lg mb-4" 
                    />
                  )}
                  
                  {/* 卡片 */}
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      if (draggedTask === task.id) return;
                      
                      handleDragOver(e, column.id, index);
                    }}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, column.id, index)}
                    className={`
                      py-6 px-4 rounded-lg transition-all duration-200 relative
                      flex items-center justify-center text-gray-700
                      ${draggedTask === task.id
                        ? 'bg-blue-100 border-2 border-dashed border-blue-400 opacity-50'
                        : 'bg-gray-50 border border-gray-200'
                      }
                      cursor-move
                    `}
                  >
                    {task.title}
                   
                  </div>
                </div>
              );
            })}
            
            {/* 列表末尾的拖拽预览指示器 */}
            {dropTarget?.columnId === column.id && dropTarget.index === column.tasks.length && (
              <div 
                style={{ height: `${draggedHeight}px` }}
                className="border-2 border-dashed border-blue-400 rounded-lg" 
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
