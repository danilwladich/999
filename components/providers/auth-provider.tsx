"use client";

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { AppLoader } from "@/components/ui/app-loader";
import { useAuthMe } from "@/hooks/useAuthMe";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  const { setUser } = useAuthMe();

  // useEffect to handle the authentication process
  useEffect(() => {
    async function authMe() {
      setIsLoading(true);

      try {
        // Making a GET request to the authentication endpoint
        const res = await axios.get("/api/auth/me");

        // Setting the authenticated user
        setUser(res.data);
      } catch (e: unknown) {
        // Handling AxiosError
        const error = e as AxiosError;

        // Handling non-response errors
        if (!error.response) {
          alert(error.message);
        }
      }

      // Setting loading status to false
      setIsLoading(false);
    }

    // Calling the authMe function when the component mounts
    authMe();
  }, []);

  // Displaying AppLoader while waiting for authentication to complete
  if (isLoading) {
    return <AppLoader />;
  }

  // Rendering children components once authentication is complete
  return children;
}
