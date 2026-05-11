import React, { useState } from 'react';
import { getDriveDirectLink } from '@/lib/videoConfig';
import { Loader2 } from 'lucide-react';

interface DriveVideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  fileId: string;
  className?: string;
  containerClassName?: string;
}

export function DriveVideoPlayer({ 
  fileId, 
  className = "", 
  containerClassName = "",
  ...props 
}: DriveVideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const videoUrl = getDriveDirectLink(fileId);

  if (!fileId) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900/50 text-zinc-500 rounded-md border border-zinc-800 ${containerClassName}`}>
        <p className="text-sm">Video ID missing</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-zinc-900 overflow-hidden ${containerClassName}`}>
      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 z-10 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
          <span className="text-white/70 text-sm font-medium animate-pulse">Loading Video...</span>
        </div>
      )}
      
      {/* Fallback to Google Drive iframe if the direct video tag fails */}
      {hasError ? (
        <iframe
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          allow="autoplay"
          allowFullScreen
          className={`w-full h-full border-none bg-black ${className}`}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <video 
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          autoPlay 
          loop 
          muted 
          playsInline
          onCanPlay={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          {...props}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
