"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import getAxiosErrorMessage from "../../../../utils/Variables/getAxiosError.util";
import toast from "react-hot-toast";

import { Globe, Lock, ArrowLeft, Edit3, X, Check, Loader2 } from "lucide-react";

import DefaultCover from "../../../../assets/Default-Cover.jpg";
import DefaultAvatar from "../../../../assets/Default-Avatar.jpg";
import PageWrapper from "../../../(components)/PageWrapper";

export default function EditableProfileCard() {
  const { data: session, status, update } = useSession();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    website: "",
    visibility: "public",
  });

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (session?.user) {
      setFormData({
        username: session.user.username || "",
        bio: session.user.bio || "",
        website: session.user.website || "",
        visibility: session.user.visibility || "public",
      });
      setIsLoading(false);
    }
  }, [session, status]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditClick = () => {
    if (session?.user) {
      setFormData({
        username: session.user.username || "",
        bio: session.user.bio || "",
        website: session.user.website || "",
        visibility: session.user.visibility || "public",
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `/api/user/profile/update-me`,
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await update();
        setIsEditing(false);
      }
    } catch (error: unknown) {
      toast.error(getAxiosErrorMessage(error, "Failed to update profile"));
    }
  };

  const handleCancel = () => {
    if (session?.user) {
      setFormData({
        username: session.user.username || "",
        bio: session.user.bio || "",
        website: session.user.website || "",
        visibility: session.user.visibility || "public",
      });
    }
    setIsEditing(false);
  };

  if (status === "loading" || isLoading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="flex items-center gap-3 text-white">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!session) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-white">Please sign in to edit your profile</div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-start justify-center p-4">
        <div className="relative border border-white/20 w-full max-w-sm lg:max-w-md xl:max-w-lg rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 shadow-2xl mx-auto">
          {/* Background Image*/}
          <div className="absolute inset-0 z-0">
            {session.user.cover_image ? (
              <Image
                src={session.user.cover_image}
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

          {/* Action Icons */}
          <div className="absolute top-4 right-4 z-20">
            {isEditing ? (
              <div className="flex gap-2">
                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="inline-flex backdrop-blur-xl bg-green-500/20 border border-green-400/50 rounded-xl p-2 sm:p-3 shadow-2xl hover:bg-green-500/30 transition-all duration-300 group"
                  title="Save changes"
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                </button>

                {/* Discard Button */}
                <button
                  onClick={handleCancel}
                  className="inline-flex backdrop-blur-xl bg-red-500/20 border border-red-400/50 rounded-xl p-2 sm:p-3 shadow-2xl hover:bg-red-500/30 transition-all duration-300 group"
                  title="Discard changes"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                {/* Edit Button */}
                <button
                  onClick={handleEditClick}
                  className="inline-flex backdrop-blur-xl bg-blue-500/20 border border-blue-400/50 rounded-xl p-2 sm:p-3 shadow-2xl hover:bg-blue-500/30 transition-all duration-300 group"
                  title="Edit profile"
                >
                  <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                </button>

                {/* Go Back Button */}
                <Link
                  href={`/profile/${session.user.user_id}`}
                  className="inline-flex backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl p-2 sm:p-3 shadow-2xl hover:bg-white/10 transition-all duration-300 group"
                  title="Go back to profile"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                </Link>
              </div>
            )}
          </div>

          <div className="mt-16 sm:mt-20 relative z-10 flex flex-col items-start gap-4 sm:gap-6">
            {/* Profile Section */}
            <div className="flex gap-3 sm:gap-4 items-start w-full">
              {/* Profile Picture - Not Editable */}
              <div className="relative flex-shrink-0">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 border-2 border-white/10 rounded-full shadow-2xl">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
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
                {/* Name - Not Editable */}
                <h1 className="font-semibold text-white text-lg sm:text-xl leading-tight tracking-tight break-words">
                  {session.user.name}
                </h1>

                {/* Username - Editable */}
                {isEditing ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                      placeholder="Enter username"
                      maxLength={20}
                    />
                    <div className="text-xs text-white/40 mt-1">
                      {formData.username.length}/20 characters
                    </div>
                  </div>
                ) : (
                  <p className="text-white/70 text-xs sm:text-sm mt-1 font-light break-words">
                    @{formData.username || session.user.username}
                  </p>
                )}
              </div>
            </div>

            {/* Rest of your component remains the same... */}
            {/* Bio & Website Section */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl w-full">
              {/* Bio - Editable */}
              <div className="mb-3 sm:mb-4">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                  Bio
                </h3>
                {isEditing ? (
                  <div>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300 resize-none"
                      placeholder="Tell us about yourself..."
                      maxLength={160}
                      rows={3}
                    />
                    <div className="text-xs text-white/40 mt-1">
                      {formData.bio.length}/160 characters
                    </div>
                  </div>
                ) : (
                  <p className="text-white/90 text-sm leading-relaxed font-light break-words">
                    {formData.bio || session.user.bio || "No bio yet"}
                  </p>
                )}
              </div>

              {/* Website - Editable */}
              <div className="mb-3 sm:mb-4">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                  Website
                </h3>
                {isEditing ? (
                  <div>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-blue-400 transition-all duration-300"
                      placeholder="https://my-cool-url.com"
                      maxLength={100}
                    />
                    <div className="text-xs text-white/40 mt-1">
                      {formData.website.length}/100 characters
                    </div>
                  </div>
                ) : formData.website || session.user.website ? (
                  <Link
                    href={formData.website || session.user.website}
                    className="group text-blue-300 hover:text-white text-sm truncate block transition-all duration-300 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-300 break-all">
                      {formData.website || session.user.website}
                    </span>
                  </Link>
                ) : (
                  <p className="text-white/50 text-sm italic">
                    No website added
                  </p>
                )}
              </div>

              {/* Visibility Toggle - Editable */}
              <div>
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                  Profile Visibility
                </h3>
                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange("visibility", "public")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                        formData.visibility === "public"
                          ? "bg-blue-500/20 border-blue-400 text-blue-300"
                          : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      Public
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange("visibility", "private")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                        formData.visibility === "private"
                          ? "bg-purple-500/20 border-purple-400 text-purple-300"
                          : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      Private
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    {formData.visibility === "public" ? (
                      <>
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-300">Public Profile</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300">Private Profile</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
