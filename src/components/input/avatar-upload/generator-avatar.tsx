import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  fallbackClassName?: string;
}

/**
 * Generates a color based on a string (name)
 * @param name - The input string (name)
 * @returns A hex color code
 */
const getColorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    '#FF6B6B', // Coral red
    '#4ECDC4', // Turquoise
    '#556FB5', // Blue
    '#9F86C0', // Purple
    '#E0AFA0', // Dusty rose
    '#6C757D', // Gray
    '#8FB339', // Green
    '#FFC145', // Yellow
    '#FF8C42', // Orange
    '#7559FF', // Violet
  ];

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Extracts initials from a name
 * @param name - Full name
 * @param maxChars - Maximum number of characters to extract
 * @returns Uppercase initials
 */
const getInitials = (name: string, maxChars: number = 2): string => {
  if (!name) return '';

  const nameParts = name.trim().split(/\s+/);

  if (nameParts.length === 1) {
    return nameParts[0].substring(0, maxChars).toUpperCase();
  }

  const firstInitial = nameParts[0].charAt(0);
  const lastInitial = nameParts[nameParts.length - 1].charAt(0);

  return (firstInitial + lastInitial).toUpperCase();
};

/**
 * Get size values based on the size prop
 * @param size - Size variant
 * @returns sizing class string
 */
const getSizeClass = (size: UserAvatarProps['size']): string => {
  const sizes = {
    xs: 'size-8',
    sm: 'size-10',
    md: 'size-12',
    lg: 'size-16',
    xl: 'size-20',
    custom: '',
  };

  return sizes[size || 'md'];
};

/**
 * Get font size values based on the size prop
 * @param size - Size variant
 * @returns font size class string
 */
const getFontSizeClass = (size: UserAvatarProps['size']): string => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    custom: 'text-base',
  };

  return sizes[size || 'md'];
};

/**
 * Determine optimal text color (black or white) based on background color
 * @param hexColor - Hex color code
 * @returns Contrasting color (black or white)
 */
const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? '#000000' : '#FFFFFF';
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  imageUrl,
  size = 'md',
  className = '',
  fallbackClassName = '',
}) => {
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);
  const textColor = getContrastColor(bgColor);
  const sizeClass = getSizeClass(size);
  const fontSizeClass = getFontSizeClass(size);

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      {imageUrl && <AvatarImage src={imageUrl} alt={`Avatar for ${name}`} />}
      <AvatarFallback
        className={fallbackClassName}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <span className={fontSizeClass}>{initials}</span>
      </AvatarFallback>
    </Avatar>
  );
};

// Example usage:
// <UserAvatar name="Jane Doe" imageUrl={user.avatar} size="md" />
// <UserAvatar name="John Smith" size="lg" className="border-2 border-blue-500" />
// <UserAvatar name="Alex Wong" size="custom" className="size-24" />
