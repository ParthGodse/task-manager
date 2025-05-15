import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function useWebSocket(boardId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/boards/${boardId}`);
    ws.onmessage = ev => {
      const msg = JSON.parse(ev.data);
      queryClient.invalidateQueries([msg.type, msg.payload?.id]);
    };
    return () => ws.close();
  }, [boardId, queryClient]);
}