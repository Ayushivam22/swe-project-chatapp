"use client";

import React, { useState } from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number; // px
  className?: string;
}

const DEFAULT_AVATAR = "/assets/default-avatar.svg";

export default function Avatar({ src, alt = "User", size = 40, className = "" }: AvatarProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || DEFAULT_AVATAR);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc || DEFAULT_AVATAR}
      alt={alt}
      width={size}
      height={size}
      onError={() => setImgSrc(DEFAULT_AVATAR)}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
