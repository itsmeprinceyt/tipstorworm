"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Settings } from "lucide-react";
import DefaultCover from "../../../assets/Default-Cover.jpg";
import DefaultAvatar from "../../../assets/Default-Avatar.jpg";

export default function ProfileCard() {
  const { data: session } = useSession();
  if (!session) return;

  return (
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

      {/* Settings Icon */}
      <div className="absolute top-4 right-4 z-20">
        <Link
          href="/dashboard/profile-edit"
          className="inline-flex backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl p-2 sm:p-3 shadow-2xl hover:bg-white/10 transition-all duration-300 group"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
        </Link>
      </div>

      <div className="mt-16 sm:mt-20 relative z-10 flex flex-col items-start gap-4 sm:gap-6">
        {/* Profile Section */}
        <div className="flex gap-3 sm:gap-4 items-start w-full">
          {/* Profile Picture */}
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
            <h1 className="font-semibold text-white text-lg sm:text-xl leading-tight tracking-tight break-words">
              {session.user.name}
            </h1>
            <p className="text-white/70 text-xs sm:text-sm mt-1 font-light break-words">
              @{session.user.username}
            </p>
          </div>
        </div>

        {/* Bio & Website Section */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl w-full">
          {session.user.bio && (
            <div className="mb-3 sm:mb-4">
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                Bio
              </h3>
              <p className="text-white/90 text-sm leading-relaxed font-light break-words">
                {session.user.bio}
              </p>
            </div>
          )}

          {session.user.website && (
            <div>
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                Website
              </h3>
              <Link
                href={session.user.website}
                className="group text-blue-300 hover:text-white text-sm truncate block transition-all duration-300 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-300 break-all">
                  {session.user.website}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
