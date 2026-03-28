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
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  // FIX: Track joining state to prevent double-clicks and show loading
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!call) {
    throw new Error('useStreamCall must be used within a StreamCall component.');
  }

  // FIX: Split into two separate effects.
  // Effect 1 — handle mic/cam toggle only (no cleanup that disables devices)
  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
    // No cleanup here — we do NOT want to disable on every toggle change.
    // Cleanup lives in Effect 2 (unmount only).
  }, [isMicCamToggled, call.camera, call.microphone]);

  // FIX: Effect 2 — cleanup runs ONLY on unmount (empty dep array)
  // This prevents the SFU error caused by disabling devices on every
  // dependency change in the original single useEffect.
  useEffect(() => {
    return () => {
      // Safe to call here — this only runs when MeetingSetup unmounts
      // (i.e. after join is complete and MeetingRoom takes over)
      call.camera.disable();
      call.microphone.disable();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps = unmount only

  // Buffer Logic
  const allowEarlyJoinBy = 5 * 60 * 1000;
  const earliestJoinTime = callStartsAt
    ? new Date(callStartsAt).getTime() - allowEarlyJoinBy
    : null;
  const callTimeNotArrived = earliestJoinTime
    ? currentTime.getTime() < earliestJoinTime
    : false;
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

  // FIX: await call.join() before setting setup complete.
  // Original code called join() without await, so MeetingRoom mounted
  // before the SFU handshake finished — causing the Host to miss the
  // initial participants snapshot and stay stuck at 1 participant.
  const handleJoin = async () => {
    if (isJoining) return;
    setIsJoining(true);
    try {
      await call.join({ create: true });
      setIsSetupComplete(true);
    } catch (error) {
      console.error('[MeetingSetup] call.join() failed:', error);
      setIsJoining(false);
    }
  };

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
        onClick={handleJoin}
        disabled={isJoining}
      >
        {isJoining ? 'Joining...' : 'Join meeting'}
      </Button>
    </div>
  );
};

export default MeetingSetup;