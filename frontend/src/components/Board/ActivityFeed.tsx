import React from 'react';
import { Activity } from '../../hooks/useActivity';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (activity: Activity) => {
    switch (activity.action) {
      case 'create':
        return '➕';
      case 'update':
        return '✏️';
      case 'delete':
        return '🗑️';
      case 'move':
        return '↔️';
      case 'comment':
        return '💬';
      default:
        return '📋';
    }
  };
  
  const getActivityMessage = (activity: Activity) => {
    const userName = activity.user_name || 'A user';
    
    switch (activity.entity_type) {
      case 'board':
        return `${userName} ${activity.action}d the board${activity.metadata?.title ? ` "${activity.metadata.title}"` : ''}`;
        
      case 'list':
        return `${userName} ${activity.action}d a list${activity.metadata?.title ? ` "${activity.metadata.title}"` : ''}`;
        
      case 'card':
        if (activity.action === 'move') {
          return `${userName} moved card${activity.metadata?.title ? ` "${activity.metadata.title}"` : ''} from ${activity.metadata?.from_list_title || 'a list'} to ${activity.metadata?.to_list_title || 'another list'}`;
        }
        return `${userName} ${activity.action}d a card${activity.metadata?.title ? ` "${activity.metadata.title}"` : ''}`;
        
      case 'comment':
        return `${userName} commented on a card`;
        
      default:
        return `${userName} performed an action`;
    }
  };
  
  if (activities.length === 0) {
    return (
      <div className="p-4 text-center">
        <h3 className="font-medium text-slate-700 mb-2">Activity</h3>
        <p className="text-slate-500 italic">No activity yet</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h3 className="font-medium text-slate-700 mb-4">Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex">
            <div className="mr-3 text-xl">{getActivityIcon(activity)}</div>
            <div className="flex-1">
              <p className="text-sm text-slate-700">{getActivityMessage(activity)}</p>
              <div className="flex items-center text-xs text-slate-500 mt-1">
                <Clock size={12} className="mr-1" />
                <span>{formatDistanceToNow(new Date(activity.created_at))} ago</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;