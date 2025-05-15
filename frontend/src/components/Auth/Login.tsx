import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrelloIcon } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card, { CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { useLogin, LoginCredentials } from '../../hooks/useAuth';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  
  const { mutate, isLoading } = useLogin();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(credentials);
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrelloIcon className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to KanbanFlow</h1>
          <p className="text-slate-600 mt-2">Sign in to continue to your boards</p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                required
                fullWidth
                value={credentials.email}
                onChange={handleChange}
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required
                fullWidth
                value={credentials.password}
                onChange={handleChange}
              />
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Sign In
              </Button>
              
              <p className="text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;