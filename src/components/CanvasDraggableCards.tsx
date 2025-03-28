"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Card {
  id: string;
  title: string;
  column: 'left' | 'right';
  order: number;
}

interface Position {
  x: number;
  y: number;
}

interface CardDimensions {
  width: number;
  height: number;
  gap: number;
  columnGap: number;
  columnWidth: number;
}

export default function CanvasDraggableCards() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });
  const [cards, setCards] = useState<Card[]>([
    { id: 'task-a', title: 'Task A', column: 'left', order: 0 },
    { id: 'task-b', title: 'Task B', column: 'left', order: 1 },
    { id: 'task-c', title: 'Task C', column: 'left', order: 2 },
    { id: 'task-d', title: 'Task D', column: 'right', order: 0 },
    { id: 'task-e', title: 'Task E', column: 'right', order: 1 },
  ]);

  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragPosition, setDragPosition] = useState<Position | null>(null);
  const [dropPreview, setDropPreview] = useState<{ column: 'left' | 'right', order: number } | null>(null);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const initialClickPos = useRef<Position | null>(null);

  // Card dimensions and layout configuration
  const dimensions: CardDimensions = {
    width: 400,
    height: 80,
    gap: 20,
    columnGap: 40,
    columnWidth: 432, // width + padding
  };

  // Get card position based on column and order
  const getCardPosition = (column: 'left' | 'right', order: number): Position => {
    const x = column === 'left' ? 16 : 16 + dimensions.columnWidth + dimensions.columnGap;
    const y = 16 + (order * (dimensions.height + dimensions.gap));
    return { x, y };
  };

  // Find card at position
  const getCardAtPosition = (x: number, y: number): Card | null => {
    // Group cards by column
    const leftCards = cards.filter(card => card.column === 'left');
    const rightCards = cards.filter(card => card.column === 'right');

    // Check each column
    for (const [column, columnCards] of [['left', leftCards], ['right', rightCards]] as const) {
      // Get actual positions for this column
      const positions = new Map<string, Position>();
      columnCards.forEach((card, index) => {
        positions.set(card.id, getCardPosition(column, index));
      });

      // Check if point is within any card in this column
      const foundCard = columnCards.find(card => {
        const pos = positions.get(card.id)!;
        return (
          x >= pos.x &&
          x <= pos.x + dimensions.width &&
          y >= pos.y &&
          y <= pos.y + dimensions.height
        );
      });

      if (foundCard) return foundCard;
    }

    return null;
  };

  // Get drop target based on mouse position
  const getDropTarget = (x: number, y: number): { column: 'left' | 'right', order: number } | null => {
    const column: 'left' | 'right' = x < (dimensions.columnWidth + dimensions.columnGap / 2) ? 'left' : 'right';
    
    // 获取目标列的卡片，排除当前拖拽的卡片
    const columnCards = cards
      .filter(card => card.column === column && card.id !== draggedCard?.id)
      .sort((a, b) => a.order - b.order);
    
    // 如果列中没有卡片，放置在开始位置
    if (columnCards.length === 0) return { column, order: 0 };

    // 计算相对于画布顶部的Y坐标
    const relativeY = y;
    const firstCardTop = 16;
    const lastCardBottom = 16 + ((columnCards.length - 1) * (dimensions.height + dimensions.gap)) + dimensions.height;

    // 如果在第一张卡片上方
    if (relativeY < firstCardTop + dimensions.height / 2) {
      return { column, order: 0 };
    }

    // 如果在最后一张卡片下方
    if (relativeY > lastCardBottom + dimensions.gap / 2) {
      return { column, order: columnCards.length };
    }

    // 检查每个卡片的位置和间隙
    for (let i = 0; i < columnCards.length; i++) {
      const cardTop = 16 + (i * (dimensions.height + dimensions.gap));
      const cardBottom = cardTop + dimensions.height;
      const nextCardTop = cardBottom + dimensions.gap;

      // 如果在当前卡片区域内
      if (relativeY >= cardTop && relativeY < cardBottom) {
        const cardMidpoint = cardTop + (dimensions.height / 2);
        return { column, order: relativeY < cardMidpoint ? i : i + 1 };
      }

      // 如果在当前卡片和下一张卡片之间的间隙中
      if (i < columnCards.length - 1 && relativeY >= cardBottom && relativeY < nextCardTop) {
        return { column, order: i + 1 };
      }
    }

    // 默认放在末尾
    return { column, order: columnCards.length };
  };

  // Draw functions
  const drawCard = (
    ctx: CanvasRenderingContext2D,
    card: Card,
    isDragged: boolean = false,
    isPreview: boolean = false,
    position?: Position
  ) => {
    const pos = isDragged ? dragPosition! : (position || getCardPosition(card.column, card.order));
    
    ctx.save();
    
    if (isPreview) {
      // Draw dotted preview
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 1;
      ctx.strokeRect(pos.x, pos.y, dimensions.width, dimensions.height);
    } else {
      // Draw card background
      ctx.fillStyle = isDragged ? '#EBF5FF' : '#F3F4F6'; // Changed default background to light gray
      ctx.fillRect(pos.x, pos.y, dimensions.width, dimensions.height);
      
      // Draw border
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1;
      ctx.strokeRect(pos.x, pos.y, dimensions.width, dimensions.height);
      
      // Draw text
      ctx.fillStyle = '#111827';
      ctx.font = '16px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        card.title,
        pos.x + dimensions.width / 2,
        pos.y + dimensions.height / 2
      );
    }
    
    ctx.restore();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw separator line
    ctx.save();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    const separatorX = 16 + dimensions.columnWidth + (dimensions.columnGap / 2);
    ctx.beginPath();
    ctx.moveTo(separatorX, 16);
    ctx.lineTo(separatorX, canvas.height - 16);
    ctx.stroke();
    ctx.restore();

    // Sort cards to ensure correct drawing order
    const sortedCards = [...cards].sort((a, b) => {
      if (a.column === b.column) {
        return a.order - b.order;
      }
      return a.column === 'left' ? -1 : 1;
    });

    // Calculate positions for all cards with real-time adjustment
    const cardPositions = new Map<string, Position>();
    
  // Group cards by column - only exclude dragged card if actually dragging
  const leftCards = sortedCards.filter(card => 
    (isDragging ? card.id !== draggedCard?.id : true) && card.column === 'left'
  );
  const rightCards = sortedCards.filter(card => 
    (isDragging ? card.id !== draggedCard?.id : true) && card.column === 'right'
  );

    // Calculate positions for each column
    ['left', 'right'].forEach(column => {
      const columnCards = column === 'left' ? leftCards : rightCards;
      
      // If this is the preview column, make space for the preview
      if (dropPreview && dropPreview.column === column) {
        columnCards.forEach((card, index) => {
          let adjustedIndex = index;
          if (index >= dropPreview.order) {
            adjustedIndex = index + 1;
          }
          cardPositions.set(card.id, getCardPosition(column as 'left' | 'right', adjustedIndex));
        });
      } 
      // Otherwise, keep cards compact
      else {
        columnCards.forEach((card, index) => {
          cardPositions.set(card.id, getCardPosition(column as 'left' | 'right', index));
        });
      }
    });

    // Draw non-dragged cards
    sortedCards.forEach(card => {
      if (card.id !== draggedCard?.id) {
        const pos = cardPositions.get(card.id)!;
        drawCard(ctx, card, false, false, pos);
      }
    });

    // Draw drop preview if needed
    if (dropPreview && draggedCard) {
      const previewPos = getCardPosition(dropPreview.column, dropPreview.order);
      drawCard(ctx, draggedCard, false, true, previewPos);
    }

    // Draw dragged card last (on top)
    if (draggedCard && dragPosition) {
      drawCard(ctx, draggedCard, true);
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    initialClickPos.current = { x, y };
    
    const card = getCardAtPosition(x, y);
    if (card) {
      // Calculate the offset from the mouse position to the card's center
      const cardPos = getCardPosition(card.column, card.order);
      const offsetX = x - (cardPos.x + dimensions.width / 2);
      const offsetY = y - (cardPos.y + dimensions.height / 2);
      
      setDraggedCard(card);
      // Store the initial mouse position and offset
      setDragPosition({ 
        x: cardPos.x, 
        y: cardPos.y 
      });
      // Store the offset in a ref so we can use it in handleMouseMove
      dragOffsetRef.current = { x: offsetX, y: offsetY };
      
      // We don't set isDragging to true yet - we'll do that in handleMouseMove
      // when we detect actual movement
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (draggedCard && initialClickPos.current) {
      // Check if we've moved enough to consider this a drag
      const dragThreshold = 5; // pixels
      const dx = Math.abs(x - initialClickPos.current.x);
      const dy = Math.abs(y - initialClickPos.current.y);
      
      // If we've moved beyond the threshold, start dragging
      if (!isDragging && (dx > dragThreshold || dy > dragThreshold)) {
        setIsDragging(true);
      }
      
      if (isDragging) {
        // Calculate new position based on mouse position
        const newX = x - dimensions.width / 2;
        const newY = y - dimensions.height / 2;
        setDragPosition({ x: newX, y: newY });

        // Calculate drop target based on the center of the card
        const centerX = x;
        const centerY = y;
        const newDropPreview = getDropTarget(centerX, centerY);
        if (newDropPreview) {
          setDropPreview(newDropPreview);
        }
      }
    }
  };

  const handleMouseUp = () => {
    // Only process drop if we're actually dragging
    if (isDragging && draggedCard && dropPreview) {
      setCards(prevCards => {
        // Create a new array with all cards except the dragged one
        const otherCards = prevCards.filter(card => card.id !== draggedCard.id);
        
        // Create a new array for the updated cards
        const updatedCards: Card[] = [];
        
        // Process each column separately
        const leftCards = otherCards.filter(card => card.column === 'left')
          .sort((a, b) => a.order - b.order);
        const rightCards = otherCards.filter(card => card.column === 'right')
          .sort((a, b) => a.order - b.order);
        
        // Insert the dragged card into the appropriate column at the right position
        if (dropPreview.column === 'left') {
          // Insert into left column
          for (let i = 0; i < leftCards.length; i++) {
            if (i === dropPreview.order) {
              // Insert the dragged card here
              updatedCards.push({
                ...draggedCard,
                column: 'left',
                order: i
              });
            }
            // Add the current card with updated order
            updatedCards.push({
              ...leftCards[i],
              order: i + (i >= dropPreview.order ? 1 : 0)
            });
          }
          
          // If the drop position is at the end of the column
          if (dropPreview.order === leftCards.length) {
            updatedCards.push({
              ...draggedCard,
              column: 'left',
              order: leftCards.length
            });
          }
          
          // Add all right column cards with their original order
          rightCards.forEach((card, index) => {
            updatedCards.push({
              ...card,
              order: index
            });
          });
        } else {
          // Insert into right column
          // Add all left column cards with their original order
          leftCards.forEach((card, index) => {
            updatedCards.push({
              ...card,
              order: index
            });
          });
          
          // Insert the dragged card into the right column
          for (let i = 0; i < rightCards.length; i++) {
            if (i === dropPreview.order) {
              // Insert the dragged card here
              updatedCards.push({
                ...draggedCard,
                column: 'right',
                order: i
              });
            }
            // Add the current card with updated order
            updatedCards.push({
              ...rightCards[i],
              order: i + (i >= dropPreview.order ? 1 : 0)
            });
          }
          
          // If the drop position is at the end of the column
          if (dropPreview.order === rightCards.length) {
            updatedCards.push({
              ...draggedCard,
              column: 'right',
              order: rightCards.length
            });
          }
        }
        
        // Return the updated cards array
        return updatedCards;
      });
    }

    // Reset drag state
    setDraggedCard(null);
    setDragPosition(null);
    setDropPreview(null);
    setIsDragging(false);
    initialClickPos.current = null;
  };

  // Setup and render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = 900; // Adjust based on your needs
    canvas.height = 600; // Adjust based on your needs

    // Initial draw
    draw();
  }, []);

  // Redraw when state changes
  useEffect(() => {
    draw();
  }, [cards, draggedCard, dragPosition, dropPreview, mousePos]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="border border-gray-200 rounded-lg"
    />
  );
}
