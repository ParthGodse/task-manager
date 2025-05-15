import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Plus, MoreHorizontal, ArrowLeft, Trash2, Activity } from 'lucide-react';
import Button from '../ui/Button';
import { useBoard, useUpdateBoard, useDeleteBoard } from '../../hooks/useBoards';
import { useLists, useCreateList, useUpdateListPositions } from '../../hooks/useLists';
import { useUpdateCardPositions } from '../../hooks/useCards';
import { useActivity } from '../../hooks/useActivity';
import useWebSocket from '../../hooks/useWebSocket';
import List from './List';
import ActivityFeed from './ActivityFeed';
import Input from '../ui/Input';

const BoardPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: board, isLoading: isBoardLoading } = useBoard(id);
  const { data: lists = [], isLoading: isListsLoading } = useLists(id);
  const { data: activities = [] } = useActivity(id);
  const updateListPositions = useUpdateListPositions();
  const updateCardPositions = useUpdateCardPositions();
  const createList = useCreateList();
  const updateBoard = useUpdateBoard();
  const deleteBoard = useDeleteBoard();
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [showActivityFeed, setShowActivityFeed] = useState(false);

  // Setup WebSocket connection for real-time updates
  useWebSocket(id);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    
    // Dropped outside the list
    if (!destination) {
      return;
    }
    
    // If the item wasn't moved
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Handle list reordering
    if (type === 'LIST') {
      const newLists = Array.from(lists);
      const [movedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, movedList);
      
      // Update positions property
      const updatedLists = newLists.map((list, index) => ({
        id: list.id,
        position: index,
      }));
      
      updateListPositions.mutate(updatedLists);
      return;
    }
    
    // Handle card reordering
    const sourceList = lists.find(list => list.id === source.droppableId);
    const destList = lists.find(list => list.id === destination.droppableId);
    
    if (!sourceList || !destList) {
      return;
    }
    
    // Get all cards from source and destination lists
    const allSourceCards = sourceList.cards || [];
    const allDestCards = sourceList.id === destList.id ? allSourceCards : (destList.cards || []);
    
    // Same list card reordering
    if (source.droppableId === destination.droppableId) {
      const newCards = Array.from(allSourceCards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);
      
      // Update positions
      const updatedCards = newCards.map((card, index) => ({
        id: card.id,
        list_id: sourceList.id,
        position: index,
      }));
      
      updateCardPositions.mutate(updatedCards);
    } else {
      // Moving card between lists
      const sourceCards = Array.from(allSourceCards);
      const destCards = Array.from(allDestCards);
      
      // Remove from source list
      const [movedCard] = sourceCards.splice(source.index, 1);
      
      // Add to destination list
      destCards.splice(destination.index, 0, { ...movedCard, list_id: destList.id });
      
      // Update all positions
      const sourceUpdatedCards = sourceCards.map((card, index) => ({
        id: card.id,
        list_id: sourceList.id,
        position: index,
      }));
      
      const destUpdatedCards = destCards.map((card, index) => ({
        id: card.id,
        list_id: destList.id,
        position: index,
      }));
      
      updateCardPositions.mutate([...sourceUpdatedCards, ...destUpdatedCards]);
    }
  };

  const handleAddList = () => {
    if (!newListTitle.trim()) return;
    
    createList.mutate({
      title: newListTitle,
      board_id: id,
      position: lists.length,
    }, {
      onSuccess: () => {
        setNewListTitle('');
        setIsAddingList(false);
      }
    });
  };

  const handleDeleteBoard = () => {
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      deleteBoard.mutate(id, {
        onSuccess: () => {
          navigate('/');
        }
      });
    }
  };

  const handleEditTitle = () => {
    if (board) {
      setEditedTitle(board.title);
      setIsEditingTitle(true);
    }
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim() && board) {
      updateBoard.mutate({
        id: board.id,
        data: { title: editedTitle }
      }, {
        onSuccess: () => {
          setIsEditingTitle(false);
        }
      });
    }
  };

  const toggleActivityFeed = () => {
    setShowActivityFeed(!showActivityFeed);
  };

  if (isBoardLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-8 bg-slate-200 w-1/4 rounded animate-pulse"></div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 w-72 bg-slate-200 rounded animate-pulse flex-shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium text-slate-700">Board not found</h2>
        <Button onClick={() => navigate('/')} className="mt-4">
          <ArrowLeft size={16} className="mr-2" />
          Back to Boards
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          
          {isEditingTitle ? (
            <div className="flex items-center">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
                className="max-w-md"
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              />
              <Button
                size="sm"
                onClick={handleSaveTitle}
                className="ml-2"
              >
                Save
              </Button>
            </div>
          ) : (
            <h1
              className="text-2xl font-bold text-slate-900 cursor-pointer hover:text-blue-700"
              onClick={handleEditTitle}
            >
              {board.title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleActivityFeed}
            className={showActivityFeed ? 'bg-blue-100' : ''}
          >
            <Activity size={16} className="mr-2" />
            Activity
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteBoard}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Board
          </Button>
        </div>
      </div>
      
      <div className="flex h-full overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-grow overflow-x-auto pb-4">
            <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex h-full"
                >
                  {isListsLoading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-full w-80 bg-slate-200 rounded mr-4 animate-pulse flex-shrink-0"></div>
                      ))}
                    </>
                  ) : (
                    <>
                      {lists.map((list, index) => (
                        <List
                          key={list.id}
                          list={list}
                          index={index}
                        />
                      ))}
                      {provided.placeholder}
                    </>
                  )}
                  
                  <div className="flex-shrink-0 w-80 ml-2">
                    {isAddingList ? (
                      <div className="bg-white p-2 rounded-md shadow-sm">
                        <Input
                          value={newListTitle}
                          onChange={(e) => setNewListTitle(e.target.value)}
                          placeholder="Enter list title..."
                          autoFocus
                          fullWidth
                          className="mb-2"
                        />
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={handleAddList}
                            disabled={!newListTitle.trim()}
                          >
                            Add List
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setIsAddingList(false);
                              setNewListTitle('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start bg-white/80 hover:bg-white"
                        onClick={() => setIsAddingList(true)}
                      >
                        <Plus size={16} className="mr-2" />
                        Add another list
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
          
          {showActivityFeed && (
            <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto">
              <ActivityFeed activities={activities} />
            </div>
          )}
        </DragDropContext>
      </div>
    </div>
  );
};

export default BoardPage;