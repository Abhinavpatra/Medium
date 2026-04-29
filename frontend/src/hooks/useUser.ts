import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../Config";
import { User, UserResponse } from "../types";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get<UserResponse>(`${BACKEND_URL}/api/v1/user/me`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((err) => {
        console.error("Error fetching user data", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { user, loading, error };
}