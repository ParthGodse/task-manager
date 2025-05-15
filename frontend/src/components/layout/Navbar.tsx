import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Plus, TrelloIcon } from 'lucide-react';
import Button from '../ui/Button';
import { useLogout } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  
  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-blue-600 font-semibold text-lg">
              <TrelloIcon className="h-6 w-6 mr-2" />
              <span>KanbanFlow</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <Plus size={16} className="mr-1" />
              <span>New Board</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-slate-700"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;