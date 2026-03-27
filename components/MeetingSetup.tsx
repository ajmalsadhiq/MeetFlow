'use client';
import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import Alert from './Alert';
import { Button } from './ui/button';

/**
 * BRUTE FORCE CLEANUP
 * Manually stops all media tracks to ensure the camera light turns off.
 */
const killAllMediaTracks = () => {
  if (typeof window !== 'undefined' && navigator.mediaDevices) {
    // We target both video and audio elements
    const mediaElements = document.querySelectorAll<HTMLVideoElement | HTMLAudioElement>('video, audio');
    
    mediaElements.forEach((el) => {
      if (el.srcObject instanceof MediaStream) {
        const tracks = el.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
          track.enabled = false;
        });
        el.srcObject = null;
      }
    });
  }
};

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const call = useCall();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second to handle the 5-min buffer live
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!call) {
    throw new Error('useStreamCall must be used within a StreamCall component.');
  }

  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }

    /**
     * CLEANUP ON UNMOUNT
     * Runs when clicking 'Join' or leaving the page.
     */
    return () => {
      call.camera.disable();
      call.microphone.disable();
      killAllMediaTracks(); // Force hardware release
    };
  }, [isMicCamToggled, call.camera, call.microphone]);

  // Buffer Logic
  const allowEarlyJoinBy = 5 * 60 * 1000;
  const earliestJoinTime = callStartsAt ? new Date(callStartsAt).getTime() - allowEarlyJoinBy : null;
  const callTimeNotArrived = earliestJoinTime ? currentTime.getTime() < earliestJoinTime : false;
  const callHasEnded = !!callEndedAt;

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt?.toLocaleString() || 'the scheduled time'}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;