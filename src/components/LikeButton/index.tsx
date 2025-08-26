"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { likeEvent } from "@/actions/events";


interface LikeButtonProps {
  eventId: string;
  userId: string;
  liked: boolean;
  count: number;
}

export default function LikeButton({ eventId, userId, liked, count }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(liked);
  const [likes, setLikes] = useState(count);

  async function handleClick() {
    const result = await likeEvent(userId, eventId); // call server action

    setIsLiked(result.liked);
    setLikes(prev => (result.liked ? prev + 1 : prev - 1));
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 transition ${
        isLiked ? "text-red-500" : "text-gray-600 hover:text-red-400"
      }`}
    >
      <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
      <span className="text-xs">{likes}</span>
    </button>
  );
}
