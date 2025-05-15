import AppRoutes from './routes';
import { Toaster } from './components/ui/Toaster';
import { ToastProvider } from './components/ui/useToast';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        <AppRoutes />
        <Toaster />
      </div>
    </ToastProvider>
  );
}

export default App;