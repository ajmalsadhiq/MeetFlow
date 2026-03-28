'use client';
import { useState, useEffect } from 'react';
import {
  useCall,
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList, X } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

// Method 1: Kill tracks on all video/audio DOM elements
// Method 2: Request a dummy stream then immediately stop it
// to force the browser to release the hardware lock fully
const killAllMediaTracks = () => {
  if (typeof window === 'undefined') return;

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

  // Force browser to release hardware lock even for tracks
  // Stream SDK holds in memory (not attached to any DOM element)
  navigator.mediaDevices
    ?.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      stream.getTracks().forEach((track) => track.stop());
    })
    .catch(() => {
      // ignore — permission may already be revoked
    });
};

const MeetingEndedScreen = ({ onClose }: { onClose: () => void }) => (
  <div className="relative flex h-screen w-full flex-col items-center justify-center gap-6 bg-dark-1 text-white">
    <button
      onClick={onClose}
      className="absolute right-6 top-6 rounded-full bg-[#19232d] p-2 hover:bg-[#4c535b] transition-colors"
      aria-label="Go to home"
    >
      <X size={20} className="text-white" />
    </button>

    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 3l18 18M10.584 10.587a2 2 0 002.828 2.83M6.343 6.343A8 8 0 0117.657 17.657M6.343 6.343A8 8 0 1117.657 17.657"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold">Meeting Ended</h1>
      <p className="max-w-sm text-slate-400">
        The host has ended this meeting for everyone.
      </p>

      <button
        onClick={onClose}
        className="mt-2 rounded-md bg-blue-1 px-6 py-2.5 font-medium text-white hover:bg-blue-600 transition-colors"
      >
        Back to Home
      </button>
    </div>
  </div>
);

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const call = useCall();

  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  // Listen for host ending the call for everyone
  useEffect(() => {
    if (!call) return;

    const handleCallEnded = () => {
      killAllMediaTracks(); // hardware first
      call.camera.disable().catch(() => {});
      call.microphone.disable().catch(() => {});
      setMeetingEnded(true);
    };

    call.on('call.ended', handleCallEnded);
    return () => {
      call.off('call.ended', handleCallEnded);
    };
  }, [call]);

  // Hardware-only cleanup on unmount
  useEffect(() => {
    return () => {
      if (!call) return;
      killAllMediaTracks(); // hardware first
      call.camera.disable().catch(() => {});
      call.microphone.disable().catch(() => {});
    };
  }, [call]);

  if (meetingEnded) {
    return <MeetingEndedScreen onClose={() => router.push('/')} />;
  }

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  const handleLeave = async () => {
    killAllMediaTracks(); // hardware first
    await Promise.allSettled([
      call?.camera.disable(),
      call?.microphone.disable(),
    ]);

    if (call && call.state.callingState !== CallingState.LEFT) {
      await call.leave();
    }

    router.push('/');
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls onLeave={handleLeave} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;