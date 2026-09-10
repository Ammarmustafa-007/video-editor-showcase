import React, { useState, useRef, useEffect } from 'react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const videoUrl = getDriveDirectLink(fileId);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || hasError) return;
    vid.load();
  }, [fileId, hasError]);

  if (!fileId) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900/50 text-zinc-500 rounded-md border border-zinc-800 ${containerClassName}`}>
        <p className="text-sm">Video ID missing</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-black overflow-hidden ${containerClassName}`}>
      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 z-10 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
          <span className="text-white/70 text-sm font-medium animate-pulse">Loading Video...</span>
        </div>
      )}

      {/* Direct video tag — primary strategy */}
      {!hasError && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
          onCanPlay={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          {...props}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Fallback: Google Drive iframe embed */}
      {hasError && (
        <div className="absolute inset-0 bg-black overflow-hidden rounded-xl">
          {/*
            Google Drive's iframe cannot be customized via CSS due to cross-origin security.
            On mobile, it natively renders two control areas: 
            1. Middle overlay (Play, Pause, Skip, Progress)
            2. Bottom bar (Volume, CC, Settings)
            
            We aggressively crop the iframe by making it 15% taller and shifting it up.
            This hides the top header and completely chops off the bottom volume/settings bar.
            Result: Only ONE set of controls (the middle play/progress overlay) is visible.
          */}
          <iframe
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            allow="autoplay"
            allowFullScreen
            className="absolute border-0"
            style={{
              top: '-10%',
              left: '-2%',
              width: '104%',
              height: '130%', // Very aggressive crop to push bottom and top bars completely off-screen
            }}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      )}
    </div>
  );
}