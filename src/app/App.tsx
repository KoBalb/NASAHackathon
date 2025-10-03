import './App.css'
import { MainRoutes }  from "../routes/MainRoutes"
import { AuthProvider } from '../AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {


  return (
    <QueryClientProvider client={queryClient}>/
    <AuthProvider>
      <MainRoutes />
    </AuthProvider>
    </QueryClientProvider>
  )
}
export default App
