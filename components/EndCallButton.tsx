'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

/**
 * TypeScript-safe hardware kill switch
 */
const killAllMediaTracks = () => {
  if (typeof window !== 'undefined' && navigator.mediaDevices) {
    const mediaElements = document.querySelectorAll<HTMLVideoElement | HTMLAudioElement>('video, audio');
    mediaElements.forEach((el) => {
      if (el.srcObject instanceof MediaStream) {
        el.srcObject.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
        el.srcObject = null;
      }
    });
  }
};

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    // 1. Disable via Stream SDK
    await call.camera.disable();
    await call.microphone.disable();

    // 2. End the meeting for all participants
    await call.endCall();
    
    // 3. Force hardware release locally
    killAllMediaTracks();
    
    // 4. Redirect
    router.push('/');
  };

  return (
    <Button 
      onClick={endCall} 
      className="bg-red-500 hover:bg-red-600 transition-colors"
    >
      End call for everyone
    </Button>
  );
};

export default EndCallButton;