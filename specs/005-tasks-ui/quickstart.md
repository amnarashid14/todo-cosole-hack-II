# Quickstart Guide: Tasks Dashboard UI

## Overview
This guide provides instructions for implementing the redesigned tasks dashboard UI with soft pastel pink/purple theme, responsive layout, and reusable components.

## Prerequisites
- Node.js 18+ installed
- Next.js 16 project initialized
- Tailwind CSS configured
- TypeScript enabled

## Setup Steps

### 1. Install Dependencies
```bash
npm install next react react-dom typescript @types/react @types/node
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Create Component Files
Create the following files based on the planned structure:
- `frontend/components/tasks/TaskNavbar.tsx`
- `frontend/components/tasks/PendingStatusCard.tsx`
- `frontend/components/tasks/CompletedStatusCard.tsx`
- `frontend/components/tasks/InProgressStatusCard.tsx`
- `frontend/components/tasks/AddTaskForm.tsx`
- `frontend/app/tasks/page.tsx`

### 3. Configure Tailwind
Update `tailwind.config.js` to include the soft pastel pink/purple theme:

```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-purple': {
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
        },
        'pastel-pink': {
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
        }
      }
    }
  },
  plugins: [],
}
```

### 4. Create Custom Hook for Responsiveness
Create `frontend/hooks/useMediaQuery.ts`:

```ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(window.matchMedia(query).matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}
```

## Component Implementation Order

1. **TaskNavbar.tsx** - Start with the navigation component
2. **Status card components** - Create the three status cards (Pending, Completed, InProgress)
3. **AddTaskForm.tsx** - Implement the form with validation
4. **tasks/page.tsx** - Combine all components in the main page

## Key Implementation Points

### Responsive Design
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) for different screen sizes
- Status cards: `flex-row` on desktop, `flex-col` on mobile
- Navigation: Full horizontal layout on desktop, hamburger menu on mobile

### Accessibility
- Add proper ARIA labels and roles
- Ensure sufficient color contrast (>4.5:1 ratio)
- Implement keyboard navigation support
- Use semantic HTML elements

### Theming
- Apply soft pastel pink/purple color palette consistently
- Use Tailwind's utility classes for styling
- Maintain visual hierarchy with appropriate sizing and spacing

## Testing Checklist
- [ ] Navigation bar displays user greeting and info correctly
- [ ] Status cards appear in row on desktop and stack on mobile
- [ ] Form validates required fields properly
- [ ] Form clears after submission
- [ ] All interactive elements have focus states
- [ ] Responsive design works across different screen sizes
- [ ] All components render without errors