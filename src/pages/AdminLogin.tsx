import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
import { LogIn, Home } from "lucide-react";
import { adminAPI } from '@/services/api';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const loginData = {
        username: username,
        password: password
      };

      const response = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("isAdmin", "true");
      toast.success("Login successful");
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Login failed");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Test server connection on component mount
  useEffect(() => {
    const testServer = async () => {
      try {
        const response = await fetch("http://localhost:5000/test");
        const data = await response.json();
        console.log("Server test response:", data);
      } catch (err) {
        console.error("Server test failed:", err);
      }
    };
    testServer();
  }, []);

  return (
    <div className="min-h-screen bg-restaurant-light-green/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-restaurant-green/20 shadow-lg">
          <CardHeader className="bg-restaurant-green text-white rounded-t-lg">
            <CardTitle className="text-center font-poppins text-2xl font-bold">
              AARKAY VAISHNO DHABA
              <p className="text-sm font-normal mt-1 opacity-90">Admin Access</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12"
                  autoComplete="username"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                  autoComplete="current-password"
                />
              </div>
              
              <Button
                type="submit" 
                className="w-full h-12 bg-restaurant-green hover:bg-restaurant-green/90 transition-all"
                disabled={loading}
              >
                <span className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  {loading ? "Logging in..." : "Log In to Admin Panel"}
                </span>
              </Button>
            </form>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full h-12 border-restaurant-green text-restaurant-green hover:bg-restaurant-green hover:text-white transition-all"
                asChild
              >
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Return to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
