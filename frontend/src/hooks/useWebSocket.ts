import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../components/ui/useToast';

interface WebSocketMessage {
  type: 'board' | 'list' | 'card' | 'comment' | 'activity';
  action: 'create' | 'update' | 'delete';
  payload: {
    id: string;
    board_id?: string;
    list_id?: string;
    card_id?: string;
    title?: string;
  };
}

export default function useWebSocket(boardId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!boardId) return;

    const wsUrl = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000';
    const ws = new WebSocket(`${wsUrl}/ws/boards/${boardId}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg: WebSocketMessage = JSON.parse(event.data);
        console.log('WebSocket message:', msg);

        // Invalidate queries based on the message type
        switch (msg.type) {
          case 'board': {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            queryClient.invalidateQueries({ queryKey: ['boards', msg.payload.id] });
            break;
          }
          case 'list': {
            if (msg.payload.board_id) {
              queryClient.invalidateQueries({
                queryKey: ['lists', msg.payload.board_id],
              });
            }
            break;
          }
          case 'card': {
            if (msg.payload.list_id) {
              queryClient.invalidateQueries({
                queryKey: ['cards', msg.payload.list_id],
              });
            }
            if (msg.action !== 'delete') {
              queryClient.invalidateQueries({
                queryKey: ['cards', 'detail', msg.payload.id],
              });
            }
            break;
          }
          case 'comment': {
            if (msg.payload.card_id) {
              queryClient.invalidateQueries({
                queryKey: ['comments', msg.payload.card_id],
              });
            }
            break;
          }
          case 'activity': {
            if (msg.payload.board_id) {
              queryClient.invalidateQueries({
                queryKey: ['activity', msg.payload.board_id],
              });
            }
            break;
          }
        }

        // Show a toast for creations (except pure activity entries)
        if (msg.action === 'create' && msg.type !== 'activity') {
          toast({
            title: `New ${msg.type} created`,
            description: msg.payload.title ? `"${msg.payload.title}"` : undefined,
            type: 'info',
          });
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [boardId, queryClient, toast]);
}
