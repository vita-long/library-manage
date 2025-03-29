import React from 'react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Hls from 'hls.js';

const HlsPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const video = videoRef.current;
    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(`http://localhost:3002/live/${id}.m3u8`);
      if (video) {
        hls.attachMedia(video);
      }
    } else if (video?.canPlayType('application/vnd.apple.mpegurl')) {
      // 原生HLS支持（Safari）
      video.src = `http://localhost:3002/live/${id}.m3u8`;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [id]);

  return (
    <div>
      <video 
        ref={videoRef} 
        controls 
        style={{ width: '100%' }}
        autoPlay
        playsInline
      />
    </div>
  );
};

export default HlsPlayer;