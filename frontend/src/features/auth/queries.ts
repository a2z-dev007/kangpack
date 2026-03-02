import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginCredentials, RegisterData } from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { ROUTES, QUERY_KEYS } from '@/lib/constants';
import { toast } from 'sonner';

export function useLogin() {
  const { setUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      console.log('🔐 Starting login...');
      try {
        const result = await authApi.login(credentials);
        console.log('✅ Login API success:', result);
        return result;
      } catch (error) {
        console.error('❌ Login API error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('📦 Login data received:', data);
      console.log('👤 User:', data.user);
      console.log('🎭 Role:', data.user?.role);
      
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
      toast.success('Login successful');
      
      // Redirect based on user role
      const userRole = data.user?.role;
      console.log('🔀 Checking redirect for role:', userRole);
      
      if (userRole === 'admin' || userRole === 'staff') {
        console.log('🚀 Redirecting to admin dashboard...');
        // Use window.location for more reliable redirect
        setTimeout(() => {
          console.log('➡️ Executing redirect to:', ROUTES.ADMIN_DASHBOARD);
          window.location.href = ROUTES.ADMIN_DASHBOARD;
        }, 100);
      } else {
        console.log('🏠 Redirecting to home...');
        setTimeout(() => {
          window.location.href = ROUTES.HOME;
        }, 100);
      }
    },
    onError: (error: any) => {
      console.error('💥 Login mutation error:', error);
      console.error('Response:', error.response);
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
}

export function useRegister() {
  const { setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: RegisterData) => authApi.register(userData),
    onSuccess: (data) => {
      setUser(data.user);
      toast.success('Registration successful');
      router.push(ROUTES.HOME);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
}

export function useLogout() {
  const { setUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      setUser(null);
      queryClient.clear();
      toast.success('Logged out successfully');
      // Redirect to home page instead of login page
      window.location.href = ROUTES.HOME;
    },
  });
}

export function useCurrentUser() {
  const { setUser } = useAuth();

  const query = useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Handle side effects
  if (query.data) {
    setUser(query.data);
  } else if (query.isError) {
    setUser(null);
  }

  return query;
}
