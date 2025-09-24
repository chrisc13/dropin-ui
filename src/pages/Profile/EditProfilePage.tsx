import React, { useEffect, useState } from "react";
import { GenericForm } from "../../components/Form/Form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { Profile } from "../../model/Profile";
import { FormFields } from "../../types/FormFields";
import "./Profile.css";
const API_BASE_URL = process.env.REACT_APP_API_URL;


export const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { username: usernameParam } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const url = usernameParam
          ?  `${API_BASE_URL}/Profile/${usernameParam}`
          :  `${API_BASE_URL}/Profile/me`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
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
  }, [usernameParam]);

  // Prepare initialValues for GenericForm
  const initialValues: FormFields<Profile> = {
    id: profile?.id ?? "",
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    username: profile?.username ?? user?.username ?? "",
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    latitude: profile?.latitude ?? 0,
    longitude: profile?.longitude ?? 0,
    profileImageUrl: profile?.profileImageUrl ?? "",
    sportLevel: profile?.sportLevel ?? {},
  };

  const handleSubmit = async (values: FormFields<Profile>) => {
    try {
      const res = await fetch( `${API_BASE_URL}/Profile/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      const data = await res.json();
      console.log("Profile upserted:", data);

      navigate(`/profile/${user?.username}`);
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div>
      <div className="edit-profile-top">
        <h1>Edit Profile</h1>
      </div>
      <GenericForm<Profile>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        formId="edit-profile-form"
        readOnlyFields={["id", "username"]}
      />
      <div className="save-profile-container">
            <button
              className="save-profile-btn"
              type="submit"
              form="edit-profile-form"
            >
              Save Profile
            </button>
          </div>
    </div>
  );
};
