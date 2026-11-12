import React from "react";

interface StudentAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function StudentAvatar({ name, size = 96, className = "" }: StudentAvatarProps) {
  const normalized = name.toLowerCase();
  const isGirl =
    normalized.includes("meera") ||
    normalized.includes("riya") ||
    normalized.includes("ananya") ||
    normalized.includes("priya") ||
    normalized.includes("tanvi") ||
    normalized.includes("diya");

  if (isGirl) {
    // Meera / Girl Avatar matching Figma Image 4
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Background circle */}
        <circle cx="50" cy="50" r="50" fill="#F4EAE0" />

        {/* Neck */}
        <rect x="44" y="58" width="12" height="15" rx="3" fill="#C68962" />

        {/* Shoulders / Top */}
        <path
          d="M26 84C26 71.5 36.5 68 50 68C63.5 68 74 71.5 74 84V100H26V84Z"
          fill="#1C2027"
        />

        {/* Long hair back */}
        <path
          d="M32 36C32 24 40 18 50 18C60 18 68 24 68 36V62C68 64 64 65 62 61L60 48H40L38 61C36 65 32 64 32 62V36Z"
          fill="#231F20"
        />

        {/* Head / Face */}
        <ellipse cx="50" cy="46" rx="16" ry="17" fill="#D99B74" />

        {/* Orange Earrings */}
        <circle cx="33" cy="48" r="2.8" fill="#FF6026" />
        <circle cx="67" cy="48" r="2.8" fill="#FF6026" />

        {/* Ears */}
        <ellipse cx="34" cy="46" rx="2.5" ry="4" fill="#C68962" />
        <ellipse cx="66" cy="46" rx="2.5" ry="4" fill="#C68962" />

        {/* Front Hair with middle parting */}
        <path
          d="M34 38C35 27 42 22 50 22C58 22 65 27 66 38C66 42 62 34 50 32C38 34 34 42 34 38Z"
          fill="#231F20"
        />
        <path
          d="M34 36C34 44 35 52 38 56C36 50 35 44 35 38H34Z"
          fill="#231F20"
        />
        <path
          d="M66 36C66 44 65 52 62 56C64 50 65 44 65 38H66Z"
          fill="#231F20"
        />

        {/* Eyebrows */}
        <path d="M41 40C43 39 45 39 46 40" stroke="#231F20" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M54 40C55 39 57 39 59 40" stroke="#231F20" strokeWidth="1.2" strokeLinecap="round" />

        {/* Eyes */}
        <circle cx="43.5" cy="44" r="2" fill="#231F20" />
        <circle cx="56.5" cy="44" r="2" fill="#231F20" />

        {/* Smile */}
        <path
          d="M46 51C48 53.5 52 53.5 54 51"
          stroke="#231F20"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Aarav / Boy Avatar matching Figma Image 4
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="50" fill="#F4EAE0" />

      {/* Neck */}
      <rect x="44" y="58" width="12" height="15" rx="3" fill="#C68962" />

      {/* Shoulders / Orange T-shirt */}
      <path
        d="M26 84C26 71.5 36.5 67 50 67C63.5 67 74 71.5 74 84V100H26V84Z"
        fill="#FF6026"
      />
      {/* Collar curve */}
      <path
        d="M44 67C46 70 54 70 56 67"
        stroke="#E05316"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Ears */}
      <ellipse cx="32" cy="46" rx="3.5" ry="5.5" fill="#C68962" />
      <ellipse cx="68" cy="46" rx="3.5" ry="5.5" fill="#C68962" />

      {/* Head / Face */}
      <ellipse cx="50" cy="46" rx="17" ry="18" fill="#D99B74" />

      {/* Short Black Hair */}
      <path
        d="M33 42C32 27 40 21 50 21C60 21 68 27 67 42C67 36 65 30 62 27C58 24 42 24 38 27C35 30 33 36 33 42Z"
        fill="#231F20"
      />
      <path
        d="M33 36C35 28 42 24 50 24C58 24 65 28 67 36C63 33 58 31 50 31C42 31 37 33 33 36Z"
        fill="#231F20"
      />

      {/* Eyebrows */}
      <path d="M40 39.5C42 38.5 45 38.5 46.5 39.5" stroke="#231F20" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M53.5 39.5C55 38.5 58 38.5 60 39.5" stroke="#231F20" strokeWidth="1.3" strokeLinecap="round" />

      {/* Eyes */}
      <circle cx="43" cy="44" r="2.2" fill="#231F20" />
      <circle cx="57" cy="44" r="2.2" fill="#231F20" />

      {/* Smile */}
      <path
        d="M45.5 51.5C47.5 54.5 52.5 54.5 54.5 51.5"
        stroke="#231F20"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

