<div align="center">
  <img src="/public/icons/logo.svg" alt="MeetFlow Logo" width="80" height="80">

  <h1>MeetFlow</h1>

  <p>A full-featured video conferencing app built with Next.js 14, Stream Video SDK, and Clerk Authentication.</p>

  <p>
    <a href="https://meet-flow-swart.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
    </a>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  </p>

  <img src="/public/icons/logo.svg" alt="MeetFlow Preview" width="100%">
</div>

---

## Features

- **Instant Meetings** — Start a meeting in one click with a shareable link
- **Scheduled Meetings** — Plan ahead with date/time scheduling
- **Personal Meeting Room** — Your own permanent meeting room with a fixed link
- **Join via Link** — Paste any meeting link to join instantly
- **Host Controls** — End call for all participants, manage the room
- **Camera & Mic Toggle** — Full hardware control with guaranteed camera light off on exit
- **Multiple Layouts** — Switch between Grid, Speaker-Left, and Speaker-Right views
- **Participant List** — See who's in the call at a glance
- **Call Statistics** — Real-time connection and stream stats
- **Meeting Recordings** — View and replay past meeting recordings
- **Upcoming Meetings** — Dashboard shows your next scheduled meeting
- **Responsive Design** — Works on desktop and mobile

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Clerk](https://clerk.com/) | Authentication & user management |
| [Stream Video React SDK](https://getstream.io/video/sdk/react/) | Video calling infrastructure |
| [shadcn/ui](https://ui.shadcn.com/) | UI components |
| [React DatePicker](https://reactdatepicker.com/) | Date/time scheduling |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Clerk](https://clerk.com/) account
- A [Stream](https://getstream.io/) account

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/MeetFlow.git
cd MeetFlow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stream
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
MeetFlow/
├── app/
│   ├── (auth)/              # Sign in / Sign up pages
│   └── (root)/
│       ├── (home)/          # Main dashboard layout
│       │   ├── page.tsx     # Home page with clock & meeting cards
│       │   ├── upcoming/    # Upcoming meetings
│       │   ├── previous/    # Past meetings
│       │   ├── recordings/  # Meeting recordings
│       │   └── personal-room/ # Personal meeting room
│       └── meeting/[id]/    # Meeting room page
├── components/
│   ├── MeetingRoom.tsx      # In-call UI with layouts & controls
│   ├── MeetingSetup.tsx     # Pre-join camera/mic setup
│   ├── MeetingTypeList.tsx  # Home cards (new, join, schedule)
│   ├── EndCallButton.tsx    # Host-only end call for everyone
│   ├── Navbar.tsx           # Top navigation
│   └── Sidebar.tsx          # Side navigation
├── hooks/
│   ├── useGetCallById.ts    # Fetch a call by ID
│   └── useGetCalls.ts       # Fetch upcoming/ended/recordings
└── providers/
    └── StreamClientProvider.tsx  # Stream video client setup
```

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Set `NEXT_PUBLIC_BASE_URL` to your Vercel deployment URL
5. Click **Deploy**

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | Your app's base URL (e.g. `https://yourapp.vercel.app`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign in route (`/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign up route (`/sign-up`) |
| `NEXT_PUBLIC_STREAM_API_KEY` | Stream API key |
| `STREAM_SECRET_KEY` | Stream secret key |

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ using Next.js & Stream</p>
</div>
