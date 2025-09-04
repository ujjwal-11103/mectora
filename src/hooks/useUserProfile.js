// src/hooks/useUserProfile.js
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;   
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user?uid=${user.uid}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  return { userProfile, loading, error, refetch: () => {} };
};