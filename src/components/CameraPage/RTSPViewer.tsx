import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useBackend } from "@/contexts/BackendContext";

interface RTSPViewerProps {
  isActive: boolean;
  ipAddress: string;
}

const RTSPViewer = ({ isActive, ipAddress }: RTSPViewerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addConsoleMessage } = useBackend();
  const [error, setError] = useState<string | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    
    const checkStreamReady = async (url: string, retries = 20, delay = 500): Promise<boolean> => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok) return true;
        } catch (e) {
          // ignore network errors
        }
        await new Promise((r) => setTimeout(r, delay));
      }
      return false;
    };


    let hls: Hls | null = null;
    if (hlsRef.current) {
      return; // Already started
    }
    if (isActive && videoRef.current && !hlsRef.current) {
      const streamUrl = `http://${ipAddress}:8888/cam/index.m3u8`;
    
      // checkStreamReady(streamUrl).then((ready) => {
      //   if (!ready) {
      //     setError("Stream not ready after timeout");
      //     return;
      //   };
  
      if (Hls.isSupported()) {
        const hls = new Hls({
          lowLatencyMode: true,
          maxLiveSyncPlaybackRate: 1.5,
        });
        // const hls = new Hls();
        hlsRef.current = hls;
    
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);
    
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          addConsoleMessage(`Playing HLS stream from ${streamUrl}`);
          videoRef.current?.play();
        });
    
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error", data);
          setError(`HLS error: ${data.details}`);
        });
      }
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [isActive, ipAddress]);

  return (
    <div className="rounded-lg overflow-hidden border border-gray-300 h-full flex items-center justify-center bg-black">
      {isActive ? (
        <>
          <video
            ref={videoRef}
            controls
            className="w-full h-full object-contain"
            autoPlay
            muted
            playsInline
          />
          {error && (
            <div className="absolute bottom-2 left-2 text-red-500 text-sm bg-black bg-opacity-60 px-2 py-1 rounded">
              {error}
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-400 text-center">
          <p className="text-lg font-medium">Live video feed</p>
          <p className="text-sm">{ipAddress}</p>
        </div>
      )}
    </div>
  );
};

export default RTSPViewer;
