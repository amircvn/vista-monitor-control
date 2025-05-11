
import { useEffect, useRef, useState } from "react";
import { useBackend } from "@/contexts/BackendContext";

interface WebRTCViewerProps {
  isActive: boolean;
}

const WebRTCViewer = ({ isActive }: WebRTCViewerProps) => {
  const { addConsoleMessage } = useBackend();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      let stream: MediaStream | null = null;

      const startWebRTC = async () => {
        try {
          // This would be replaced with actual WebRTC connection code in a real app
          // Here we're just using the user's camera to simulate WebRTC
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            addConsoleMessage("WebRTC stream connected");
          }
        } catch (err) {
          setError("Failed to access camera: " + (err instanceof Error ? err.message : String(err)));
          addConsoleMessage("WebRTC connection error: " + (err instanceof Error ? err.message : String(err)));
        }
      };

      startWebRTC();

      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          addConsoleMessage("WebRTC stream disconnected");
        }
      };
    }
  }, [isActive, addConsoleMessage]);

  return (
    <div className="rounded-lg overflow-hidden border border-gray-300 h-full flex items-center justify-center bg-gray-900">
      {isActive ? (
        error ? (
          <div className="text-red-500 p-4 text-center">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            muted
          />
        )
      ) : (
        <div className="text-gray-400 text-center">
          <p className="text-lg font-medium">Live video feed</p>
          <p className="text-sm">WEB RTC</p>
        </div>
      )}
    </div>
  );
};

export default WebRTCViewer;
