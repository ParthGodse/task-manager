import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Calendar, Tag, Trash2 } from 'lucide-react';
import { useCard, useUpdateCard, useDeleteCard } from '../../hooks/useCards';
import { useComments, useAddComment } from '../../hooks/useComments';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { format } from 'date-fns';

interface CardDetailProps {
  cardId: string;
  onClose: () => void;
}

const CardDetail: React.FC<CardDetailProps> = ({ cardId, onClose }) => {
  const { data: card, isLoading: isCardLoading } = useCard(cardId);
  const { data: comments = [], isLoading: isCommentsLoading } = useComments(cardId);
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const addComment = useAddComment();
  
  const [newComment, setNewComment] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  
  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setDueDate(card.due_date ? format(new Date(card.due_date), 'yyyy-MM-dd') : '');
    }
  }, [card]);
  
  const handleTitleSave = () => {
    if (title.trim() && card) {
      updateCard.mutate({
        id: card.id,
        data: { title },
      });
      setIsEditingTitle(false);
    }
  };
  
  const handleDescriptionSave = () => {
    if (card) {
      updateCard.mutate({
        id: card.id,
        data: { description },
      });
      setIsEditingDescription(false);
    }
  };
  
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
    if (card) {
      updateCard.mutate({
        id: card.id,
        data: { due_date: e.target.value ? new Date(e.target.value).toISOString() : undefined },
      });
    }
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    addComment.mutate({
      cardId,
      content: newComment,
    }, {
      onSuccess: () => {
        setNewComment('');
      }
    });
  };
  
  const handleDeleteCard = () => {
    if (window.confirm('Are you sure you want to delete this card?') && card) {
      deleteCard.mutate({
        id: card.id,
        listId: card.list_id,
      }, {
        onSuccess: onClose,
      });
    }
  };
  
  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (isCardLoading || !card) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={handleClickOutside}
      >
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in">
          <div className="p-6">
            <div className="h-6 bg-slate-200 w-1/3 rounded animate-pulse mb-4"></div>
            <div className="h-20 bg-slate-200 rounded animate-pulse mb-4"></div>
            <div className="h-8 bg-slate-200 w-1/2 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClickOutside}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <MessageSquare size={18} className="text-slate-500 mr-2" />
            <h2 className="text-lg font-semibold">Card Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-4rem)]">
          <div className="mb-6">
            {isEditingTitle ? (
              <div className="mb-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  fullWidth
                  className="text-xl font-semibold"
                />
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" onClick={handleTitleSave}>Save</Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setTitle(card.title);
                      setIsEditingTitle(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <h3
                className="text-xl font-semibold mb-2 cursor-pointer hover:bg-slate-100 p-1 rounded"
                onClick={() => setIsEditingTitle(true)}
              >
                {card.title}
              </h3>
            )}
            
            <div className="text-sm text-slate-500">
              In list <span className="font-medium">{card.list_title}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="mb-6">
                <h4 className="font-medium text-slate-700 mb-2">Description</h4>
                {isEditingDescription ? (
                  <div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      placeholder="Add a more detailed description..."
                      autoFocus
                    />
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm" onClick={handleDescriptionSave}>Save</Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setDescription(card.description || '');
                          setIsEditingDescription(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-2 rounded-md cursor-pointer hover:bg-slate-100 ${
                      !description ? 'text-slate-500 italic' : 'text-slate-700'
                    }`}
                    onClick={() => setIsEditingDescription(true)}
                  >
                    {description || 'Add a more detailed description...'}
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-slate-700 mb-2">Comments</h4>
                
                <form onSubmit={handleCommentSubmit} className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    placeholder="Write a comment..."
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="mt-2"
                    disabled={!newComment.trim()}
                  >
                    Add Comment
                  </Button>
                </form>
                
                {isCommentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 bg-slate-200 rounded-full mr-2"></div>
                          <div className="h-4 w-24 bg-slate-200 rounded"></div>
                        </div>
                        <div className="h-16 bg-slate-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-slate-500 italic">No comments yet</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-50 p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{comment.user_name || 'User'}</div>
                          <div className="text-xs text-slate-500">
                            {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
                          </div>
                        </div>
                        <p className="text-slate-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-span-1">
              <h4 className="font-medium text-slate-700 mb-2">Add to Card</h4>
              
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-slate-600 mb-1 flex items-center">
                    <Calendar size={14} className="mr-1" /> Due Date
                  </h5>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={handleDueDateChange}
                    fullWidth
                  />
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-slate-600 mb-1 flex items-center">
                    <Tag size={14} className="mr-1" /> Labels
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {(card.labels || []).map((label) => (
                      <div
                        key={label}
                        className="px-2 py-1 rounded text-xs text-white font-medium"
                        style={{
                          backgroundColor: 
                            label === 'bug' ? '#F87171' :
                            label === 'feature' ? '#34D399' :
                            label === 'enhancement' ? '#60A5FA' :
                            label === 'documentation' ? '#FBBF24' :
                            label === 'question' ? '#A78BFA' :
                            '#9CA3AF'
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6">
                  <h4 className="font-medium text-slate-700 mb-2">Actions</h4>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteCard}
                    className="w-full"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete Card
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;