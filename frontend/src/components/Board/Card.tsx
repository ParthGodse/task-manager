import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { MessageSquare, Calendar, Tag } from 'lucide-react';
import { Card as CardType } from '../../hooks/useCards';
import CardDetail from './CardDetail';
import { format } from 'date-fns';

interface CardProps {
  card: CardType;
  index: number;
}

const Card: React.FC<CardProps> = ({ card, index }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const handleOpenDetail = () => {
    setIsDetailOpen(true);
  };
  
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };
  
  const labelColors = {
    bug: 'bg-red-400',
    feature: 'bg-green-400',
    enhancement: 'bg-blue-400',
    documentation: 'bg-yellow-400',
    question: 'bg-purple-400',
  };
  
  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white rounded-md shadow-sm p-2 mb-2 hover:shadow-md transition-shadow cursor-grab ${
              snapshot.isDragging ? 'shadow-md rotate-3' : ''
            }`}
            onClick={handleOpenDetail}
          >
            {card.labels && card.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {card.labels.map((label) => (
                  <div
                    key={label}
                    className={`h-2 w-12 rounded-full ${labelColors[label as keyof typeof labelColors] || 'bg-gray-400'}`}
                    title={label}
                  />
                ))}
              </div>
            )}
            
            <h4 className="font-medium text-slate-800 mb-2">{card.title}</h4>
            
            {card.description && (
              <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                {card.description}
              </p>
            )}
            
            <div className="flex items-center text-xs text-slate-500 mt-2">
              {card.due_date && (
                <div className="flex items-center mr-3" title={format(new Date(card.due_date), 'PPP')}>
                  <Calendar size={12} className="mr-1" />
                  <span>{format(new Date(card.due_date), 'MMM d')}</span>
                </div>
              )}
              
              {card.comment_count > 0 && (
                <div className="flex items-center">
                  <MessageSquare size={12} className="mr-1" />
                  <span>{card.comment_count}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
      
      {isDetailOpen && (
        <CardDetail
          cardId={card.id}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
};

export default Card;