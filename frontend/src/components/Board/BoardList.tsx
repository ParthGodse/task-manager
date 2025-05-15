import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, CalendarDays } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/input';
import { useBoards, useCreateBoard } from '../../hooks/useBoards';
import { formatDistanceToNow } from 'date-fns';

const BoardList: React.FC = () => {
  const { data: boards = [], isLoading } = useBoards();
  const createBoard = useCreateBoard();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newBoard, setNewBoard] = useState({ title: '', description: '' });
  
  const handleCreateClick = () => {
    setIsCreating(true);
  };
  
  const handleCancel = () => {
    setIsCreating(false);
    setNewBoard({ title: '', description: '' });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBoard.mutate(newBoard, {
      onSuccess: () => {
        setIsCreating(false);
        setNewBoard({ title: '', description: '' });
      }
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBoard((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleBoardClick = (id: string) => {
    navigate(`/boards/${id}`);
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your Boards</h1>
        {!isCreating && (
          <Button onClick={handleCreateClick}>
            <Plus size={16} className="mr-2" />
            New Board
          </Button>
        )}
      </div>
      
      {isCreating && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Board Title"
                name="title"
                value={newBoard.title}
                onChange={handleInputChange}
                placeholder="Enter board title"
                required
                fullWidth
                autoFocus
              />
              
              <Input
                label="Description (optional)"
                name="description"
                value={newBoard.description}
                onChange={handleInputChange}
                placeholder="Enter board description"
                fullWidth
              />
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={createBoard.status === 'pending'}
                >
                  Create Board
                </Button>
              </div>
            </form>
          </CardContent>
          </Card>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-slate-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : boards.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-medium text-slate-700">No boards yet</h2>
          <p className="text-slate-500 mt-2">Create your first board to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              key={board.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleBoardClick(board.id)}
            >
              <Card>
            >
              <CardContent className="p-4 h-36 flex flex-col">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{board.title}</h3>
                {board.description && (
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">{board.description}</p>
                )}
                <div className="mt-auto flex items-center text-xs text-slate-500">
                  <Clock size={14} className="mr-1" />
                  <span>Created {formatDistanceToNow(new Date(board.created_at))} ago</span>
                  {board.created_at !== board.updated_at && (
                    <div className="ml-4 flex items-center">
                      <CalendarDays size={14} className="mr-1" />
                      <span>Updated {formatDistanceToNow(new Date(board.updated_at))} ago</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;