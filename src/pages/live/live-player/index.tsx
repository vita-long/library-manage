import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import flv from 'flv.js';

const LivePlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const player = flv.createPlayer({
      type: 'flv',
      url: `http://localhost:3002/live/${id}.flv`
    });
    
    if (videoRef.current) {
      player.attachMediaElement(videoRef.current);
      player.load();
      // player.play();
    }

    return () => {
      player.destroy();
    };
  }, [id]);

  return (
    <div>
      <video ref={videoRef} controls src="" style={{ width: '100%' }} />
    </div>
  );
};

export default LivePlayer;