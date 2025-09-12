import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { Profile } from "../../model/Profile";

export const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth(); // logged-in user
  const { username: usernameParam } = useParams<{ username: string }>(); // route param for public profiles
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !usernameParam || usernameParam === authUser?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const url = isOwnProfile
          ? "http://localhost:5084/Profile/me" // private endpoint
          : `http://localhost:5084/Profile/${usernameParam}`; // public endpoint

        const res = await fetch(url, {
          headers: {
            "Authorization": authUser ? `Bearer ${sessionStorage.getItem("accessToken")}` : "",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data: Profile = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [usernameParam, authUser, isOwnProfile]);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      {profile.profileImageUrl && (
        <img src={profile.profileImageUrl} alt={`${profile.username}'s avatar`} width={150} />
      )}
      <p>Name: {profile.firstName} {profile.lastName}</p>
      <p>Bio: {profile.bio}</p>
      <p>Location: {profile.location}</p>

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

      {isOwnProfile && <button>Edit Profile</button>}
    </div>
  );
};
