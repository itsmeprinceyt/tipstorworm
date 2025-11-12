"use client";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import getAxiosErrorMessage from "../../../utils/Variables/getAxiosError.util";

import { Settings, Lock } from "lucide-react";
import DefaultCover from "../../../assets/Default-Cover.jpg";
import DefaultAvatar from "../../../assets/Default-Avatar.jpg";

import { PublicProfileData } from "../../../types/User/Profile/PublicProfile.type";

export default function ProfileCard({ profile }: { profile: string }) {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<PublicProfileData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (session?.user?.user_id === profile) {
        setProfileData({
          user_id: session.user.user_id!,
          name: session.user.name!,
          username: session.user.username!,
          image: session.user.image!,
          cover_image: session.user.cover_image!,
          bio: session.user.bio,
          website: session.user.website,
          visibility: session.user.visibility,
          created_at: "",
          is_own_profile: true,
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/user/${profile}`);
        if (response.data.success) {
          setProfileData(response.data.profile);
        }
      } catch (error: unknown) {
        const errorMessage = getAxiosErrorMessage(
          error,
          "Failed to load profile"
        );
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchProfileData();
    }
  }, [profile, session]);

  if (loading) {
    return (
      <div className="relative border border-white/20 w-full max-w-sm lg:max-w-md xl:max-w-lg rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 shadow-2xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error === "Private Profile") {
    return (
      <div className="relative border border-white/20 w-full max-w-sm lg:max-w-md xl:max-w-lg rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 shadow-2xl mx-auto">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black to-transparent rounded-2xl md:rounded-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center py-16 text-center">
          <Lock className="w-16 h-16 text-white/50 mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">
            Private Profile
          </h2>
          <p className="text-white/70 text-sm">
            This profile is set to private
          </p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="relative border border-white/20 w-full max-w-sm lg:max-w-md xl:max-w-lg rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 shadow-2xl mx-auto">
        <div className="text-center py-12 text-white/70">
          Failed to load profile
        </div>
      </div>
    );
  }

  return (
    <div className="relative border border-white/20 w-full max-w-sm lg:max-w-md xl:max-w-lg rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 shadow-2xl mx-auto">
      {/* Background Image*/}
      <div className="absolute inset-0 z-0">
        {profileData.cover_image ? (
          <Image
            src={profileData.cover_image}
            fill
            className="object-cover rounded-2xl md:rounded-3xl"
            alt="Cover Image"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <Image
            src={DefaultCover}
            fill
            className="object-cover rounded-2xl md:rounded-3xl"
            alt="Cover Image"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-2xl md:rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl md:rounded-3xl" />
      </div>

      {/* Settings Icon - Only show for own profile */}
      {profileData.is_own_profile && (
        <div className="absolute top-4 right-4 z-20">
          <Link
            href={`settings`}
            className="inline-flex backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl p-2 sm:p-3 shadow-2xl hover:bg-white/10 transition-all duration-300 group"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
          </Link>
        </div>
      )}

      <div className="mt-16 sm:mt-20 relative z-10 flex flex-col items-start gap-4 sm:gap-6">
        {/* Profile Section */}
        <div className="flex gap-3 sm:gap-4 items-start w-full">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 border border-white/10 rounded-full shadow-2xl">
              {profileData.image ? (
                <Image
                  src={profileData.image}
                  fill
                  className="object-cover rounded-full"
                  alt="Profile Image"
                  sizes="(max-width: 640px) 64px, 80px"
                />
              ) : (
                <Image
                  src={DefaultAvatar}
                  fill
                  className="object-cover rounded-full"
                  alt="Profile Image"
                  sizes="(max-width: 640px) 64px, 80px"
                />
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl flex-1 min-w-0">
            <h1 className="font-semibold text-white text-lg sm:text-xl leading-tight tracking-tight break-words">
              {profileData.name}
            </h1>
            <p className="text-white/70 text-xs sm:text-sm mt-1 font-light break-words">
              @{profileData.username}
            </p>
          </div>
        </div>

        {/* Bio & Website Section */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl w-full">
          {profileData.bio && (
            <div className="mb-3 sm:mb-4">
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                Bio
              </h3>
              <p className="text-white/90 text-sm leading-relaxed font-light break-words">
                {profileData.bio}
              </p>
            </div>
          )}

          {profileData.website && (
            <div>
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                Website
              </h3>
              <Link
                href={profileData.website}
                className="group text-blue-300 hover:text-white text-sm truncate block transition-all duration-300 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-300 break-all">
                  {profileData.website}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
