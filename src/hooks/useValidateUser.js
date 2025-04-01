import { useEffect, useState } from "react";
import { getAccount } from "../appwrite/appwrite.config";

export const useValidateUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const account = await getAccount();

        if (account) {
          setUser(account);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching account:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return { user, loading, setUser };
};
