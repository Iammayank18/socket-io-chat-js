"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccount } from "../appwrite/appwrite.config";

export default function AuthRedirect() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const account = await getAccount();

        if (account) {
          setUser(account);
        }
      } catch (error) {
        console.error("Error fetching account:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard/chat");
      } else {
        router.push("/auth/login");
      }
    }
  }, [loading, user, router]);

  return loading ? (
    <div className="flex justify-between items-center h-screen w-screen text-center">
      <p className="font-bold text-xl w-full">Loading...</p>
    </div>
  ) : null;
}
