import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { MoreHorizontal, Plus, Trash } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from './Card';
import { List } from '../../hooks/useLists';
import { Card as CardType, useCreateCard, useCards } from '../../hooks/useCards';
import { useDeleteList, useUpdateList } from '../../hooks/useLists';

interface ListProps {
  list: List;
  index: number;
}

const ListComponent: React.FC<ListProps> = ({ list, index }) => {
  const { data: cards = [] } = useCards(list.id);
  const createCard = useCreateCard();
  const updateList = useUpdateList();
  const deleteList = useDeleteList();
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  
  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;
    
    createCard.mutate({
      title: newCardTitle,
      list_id: list.id,
      position: cards.length,
    }, {
      onSuccess: () => {
        setNewCardTitle('');
        setIsAddingCard(false);
      }
    });
  };
  
  const handleEditTitle = () => {
    setIsEditingTitle(true);
    setEditedTitle(list.title);
  };
  
  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== list.title) {
      updateList.mutate({
        id: list.id,
        data: { title: editedTitle },
      }, {
        onSuccess: () => {
          setIsEditingTitle(false);
        }
      });
    } else {
      setEditedTitle(list.title);
      setIsEditingTitle(false);
    }
  };
  
  const handleDeleteList = () => {
    if (window.confirm(`Are you sure you want to delete the list "${list.title}"?`)) {
      deleteList.mutate({
        id: list.id,
        boardId: list.board_id,
      });
    }
  };
  
  // Sort cards by position
  const sortedCards = [...cards].sort((a, b) => a.position - b.position);
  
  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex-shrink-0 w-80 mr-3 flex flex-col max-h-full"
        >
          <div
            className="bg-slate-100 rounded-t-md p-2 flex items-center justify-between sticky top-0 z-10"
            {...provided.dragHandleProps}
          >
            {isEditingTitle ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
                className="flex-grow"
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              />
            ) : (
              <h3
                className="font-medium text-slate-800 px-1 py-1 cursor-pointer hover:bg-slate-200 rounded"
                onClick={handleEditTitle}
              >
                {list.title}
              </h3>
            )}
            
            <button
              className="text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-200"
              onClick={handleDeleteList}
              aria-label="Delete list"
            >
              <Trash size={16} />
            </button>
          </div>
          
          <Droppable droppableId={list.id} type="CARD">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-grow overflow-y-auto p-2 rounded-b-md ${
                  snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-slate-100'
                }`}
              >
                {sortedCards.map((card, cardIndex) => (
                  <Card key={card.id} card={card} index={cardIndex} />
                ))}
                {provided.placeholder}
                
                {isAddingCard ? (
                  <div className="bg-white p-2 rounded-md shadow-sm mt-2">
                    <Input
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      placeholder="Enter card title..."
                      autoFocus
                      fullWidth
                      className="mb-2"
                    />
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={handleAddCard}
                        disabled={!newCardTitle.trim()}
                      >
                        Add Card
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsAddingCard(false);
                          setNewCardTitle('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start mt-2"
                    onClick={() => setIsAddingCard(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    Add a card
                  </Button>
                )}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default ListComponent;