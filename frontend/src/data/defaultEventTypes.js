/** Default seed data — kept in sync with localStorage for public booking pages. */
export const DEFAULT_EVENT_TYPES = [
  {
    id: 1,
    title: 'Quick Chat',
    description:
      'A short 15-minute catch-up call for quick questions or introductions.',
    duration: 15,
    location: 'Google Meet',
    slug: 'quick-chat',
    color: 'blue',
    enabled: true,
  },
  {
    id: 2,
    title: 'Strategy Session',
    description:
      'Dive into roadmap, priorities, and next steps with your team.',
    duration: 30,
    location: 'Zoom',
    slug: 'strategy-session',
    color: 'purple',
    enabled: true,
  },
  {
    id: 3,
    title: 'Product Demo',
    description:
      'Walk through features tailored to your use case and questions.',
    duration: 45,
    location: 'Google Meet',
    slug: 'product-demo',
    color: 'green',
    enabled: true,
  },
  {
    id: 4,
    title: 'Deep Dive Workshop',
    description:
      'Hands-on working session for advanced topics and implementation.',
    duration: 60,
    location: 'Zoom',
    slug: 'deep-dive-workshop',
    color: 'orange',
    enabled: true,
  },
];
