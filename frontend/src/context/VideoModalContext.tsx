"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { ASSETS } from "@/constants/assets";

interface VideoModalContextType {
  isOpen: boolean;
  videoSrc: string;
  openVideo: (src?: string) => void;
  closeVideo: () => void;
}

const VideoModalContext = createContext<VideoModalContextType | undefined>(undefined);

export const VideoModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>(ASSETS.VIDEOS.PRODUCT_MAIN);

  const openVideo = useCallback((src?: string) => {
    if (src) {
      setVideoSrc(src);
    } else {
      setVideoSrc(ASSETS.VIDEOS.PRODUCT_MAIN);
    }
    setIsOpen(true);
  }, []);

  const closeVideo = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      videoSrc,
      openVideo,
      closeVideo,
    }),
    [isOpen, videoSrc, openVideo, closeVideo]
  );

  return (
    <VideoModalContext.Provider value={value}>
      {children}
    </VideoModalContext.Provider>
  );
};

export const useVideoModal = (): VideoModalContextType => {
  const context = useContext(VideoModalContext);
  if (!context) {
    throw new Error("useVideoModal must be used within a VideoModalProvider");
  }
  return context;
};
