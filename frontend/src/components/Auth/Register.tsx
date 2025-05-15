import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrelloIcon } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card, { CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { useRegister, RegisterCredentials } from '../../hooks/useAuth';

const Register: React.FC = () => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
  });
  
  const { mutate, isLoading } = useRegister();
  
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
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-600 mt-2">Start organizing your tasks with KanbanFlow</p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Register</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Input
                label="Name"
                type="text"
                name="name"
                id="name"
                placeholder="Your name"
                required
                fullWidth
                value={credentials.name}
                onChange={handleChange}
              />
              
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
                minLength={6}
              />
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Create Account
              </Button>
              
              <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;