import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { Profile } from "../../model/Profile";
import "./Profile.css";
import { Avatar } from "../../components/Profile/Avatar";
import { ProfileActions } from "./ProfileActions";

const API_BASE_URL = process.env.REACT_APP_API_URL;
export const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth(); // logged-in user
  const { username: usernameParam } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine if the profile is the logged-in user's
  const isOwnProfile = !usernameParam || usernameParam === authUser?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = sessionStorage.getItem("accessToken");
        const url = isOwnProfile
          ?  `${API_BASE_URL}/Profile/me`
          :  `${API_BASE_URL}/Profile/${usernameParam}`;

        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error("Profile not found");
          throw new Error("Failed to fetch profile");
        }

        const data: Profile = await res.json();
        setProfile(data);
      } catch (err) {
        setError((err as Error).message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [usernameParam, isOwnProfile]);
 
  if (loading) return <p className="loading">Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!profile) return null;

  return (
    <div className="profile-page">
      <h1>{profile.username}'s Profile</h1>

      <div className="profile-page-avatar">
      <Avatar username={profile.username} avatarUrl={profile.profileImageUrl} size={150} />
      </div>

      <p>Name: {profile.firstName ?? ""} {profile.lastName ?? ""}</p>
      <p>Bio: {profile.bio ?? "No bio"}</p>
      <p>Location: {profile.location ?? "Unknown"}</p>

      <h3>Sports & Levels:</h3>
      {profile.sportLevel ? (
        <ul>
          {Object.entries(profile.sportLevel).map(([sport, level]) => (
            <li key={sport}>{sport}: {level}</li>
          ))}
        </ul>
      ) : (
        <p>No sports listed.</p>
      )}
      <div className="profile-user-actions-wrapper">
      <button
                className="btn"
                onClick={() => navigate(`/events/${profile.username}`)}
            >
                Events
            </button>
      {isOwnProfile && 
            <button
                className="btn"
                onClick={() => navigate(`/editprofile/${profile.username}`)}
            >
                Edit Profile
            </button>
        }
        </div>


    </div>
  );
};
