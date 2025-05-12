
import { useEffect, useRef, useState } from "react";
import { useBackend } from "@/contexts/BackendContext";

interface WebRTCViewerProps {
  isActive: boolean;
  ipAddress: string;
}

const WebRTCViewer = ({ isActive, ipAddress }: WebRTCViewerProps) => {
  const { addConsoleMessage } = useBackend();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startWebRTC = async () => {
      try {
        const res = await fetch("http://192.168.1.21:8554/cam", {
          method: "POST",
          body: JSON.stringify({ url: "rtsp://192.168.1.21:8554/cam" }),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const offer = await res.json();
    
        const pc = new RTCPeerConnection();
        const desc = new RTCSessionDescription(offer);
        await pc.setRemoteDescription(desc);
    
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
    
        const res2 = await fetch("http://192.168.1.21:8554/cam", {
          method: "POST",
          body: JSON.stringify({ answer: pc.localDescription }),
          headers: {
            "Content-Type": "application/json"
          }
        });
    
        pc.ontrack = (event) => {
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
          }
        };
      } catch (err) {
        setError("Failed to connect to WebRTC stream");
        console.error(err);
      }
    };
    // const startWebRTC = async () => {
    //   if (isActive) {
    //     try {
    //       addConsoleMessage(`Connecting to WebRTC stream at ${ipAddress}...`);
          
    //       // In a real application, you would use WebRTC to connect to the IP
    //       // For this demo, we're simulating with the user's camera
    //       // In production, replace this with actual WebRTC connection code to the specified IP
    //       stream = await navigator.mediaDevices.getUserMedia({
    //         video: true,
    //         audio: false,
    //       });
          
    //       if (videoRef.current) {
    //         videoRef.current.srcObject = stream;
    //         addConsoleMessage(`WebRTC stream connected to ${ipAddress}`);
    //       }
    //     } catch (err) {
    //       setError(`Failed to connect to camera at ${ipAddress}: ` + (err instanceof Error ? err.message : String(err)));
    //       addConsoleMessage(`WebRTC connection error: ` + (err instanceof Error ? err.message : String(err)));
    //     }
    //   } else {
    //     // Stop the stream if it exists
    //     if (stream) {
    //       stream.getTracks().forEach(track => track.stop());
    //       addConsoleMessage(`WebRTC stream disconnected from ${ipAddress}`);
    //       setError(null);
    //     }
    //   }
    // };

    startWebRTC();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        addConsoleMessage(`WebRTC stream disconnected from ${ipAddress}`);
      }
    };
  }, [isActive, ipAddress, addConsoleMessage]);

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
          <p className="text-sm">{ipAddress}</p>
        </div>
      )}
    </div>
  );
};

export default WebRTCViewer;
