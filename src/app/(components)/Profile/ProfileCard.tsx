"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import DefaultCover from "../../../assets/Default-Cover.jpg";
import DefaultAvatar from "../../../assets/Default-Avatar.jpg";
import Link from "next/link";

export default function ProfileCard() {
    const { data: session } = useSession();
    if (!session) return;

    return (
        <div className="relative border border-white/20 max-w-sm w-full rounded-3xl p-8 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 shadow-2xl">
            {/* Background Image*/}
            <div className="absolute inset-0 z-0">
                {session.user.cover_image ? (
                    <Image
                        src={session.user.cover_image}
                        fill
                        className="object-cover rounded-3xl"
                        alt="Cover Image"
                        priority
                    />
                ) : (
                    <Image
                        src={DefaultCover}
                        fill
                        className="object-cover rounded-3xl"
                        alt="Cover Image"
                        priority
                    />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl" />
            </div>

            <div className="mt-20 relative z-10 flex flex-col items-start gap-6">
                {/* Profile Section */}
                <div className="flex gap-4 items-start w-full">
                    {/* Profile Picture */}
                    <div className="relative">
                        <div className="relative h-20 w-20 border-2 border-white/10 rounded-full shadow-2xl">
                            {session.user.image ? (
                                <Image
                                    src={session.user.image}
                                    fill
                                    className="object-cover rounded-full"
                                    alt="Profile Image"
                                />
                            ) : (
                                <Image
                                    src={DefaultAvatar}
                                    fill
                                    className="object-cover rounded-full"
                                    alt="Profile Image"
                                />
                            )}
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-4 shadow-2xl flex-1">
                        <h1 className="font-semibold text-white text-xl leading-tight tracking-tight">
                            {session.user.name}
                        </h1>
                        <p className="text-white/70 text-sm mt-1 font-light">@{session.user.username}</p>
                    </div>
                </div>

                {/* Bio & Website Section */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-5 shadow-2xl w-full">
                    {session.user.bio && (
                        <div className="mb-4">
                            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                                Bio
                            </h3>
                            <p className="text-white/90 text-sm leading-relaxed font-light">
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
                                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-300">
                                    {session.user.website}
                                </span>
                                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}