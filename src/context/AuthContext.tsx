import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/hooks/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdat: string;
  updatedat: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

interface LoginResponse {
  success: boolean;
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userData = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(role === "admin");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUser(null);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post("/login-user", {
        email,
        password,
      });
      if (response.data) {
        localStorage.setItem("token", response.data?.token);
        localStorage.setItem("role", response.data?.user?.role);
        setIsAdmin(response.data?.user?.role === "admin");
        localStorage.setItem("user", JSON.stringify(response.data?.user));
        document.cookie = `token=${response.data?.token}; path=/; secure`;
        setIsLoggedIn(true);
        return { success: true };
      } else {
        return {
          success: false,
          message: "Invalid response data",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    document.cookie = "token=; Max-Age=0; path=/;";
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
