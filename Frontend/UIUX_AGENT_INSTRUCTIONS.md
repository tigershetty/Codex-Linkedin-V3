# UI/UX Design Best Practices - Agent Instructions

> **Purpose:** Comprehensive guidelines for AI agents building frontend interfaces and user experiences.
> **Sources:** Nielsen Norman Group, Material Design 3, Apple HIG, WCAG 2.1/2.2 standards.

---

## Table of Contents

1. [Quick Reference](#1-quick-reference)
2. [Visual Design Principles](#2-visual-design-principles)
3. [Interaction Design](#3-interaction-design)
4. [Information Architecture](#4-information-architecture)
5. [Accessibility (WCAG)](#5-accessibility-wcag)
6. [Responsive Design](#6-responsive-design)
7. [Performance UX](#7-performance-ux)
8. [Modern Patterns (2025)](#8-modern-patterns-2025)
9. [Code Examples](#9-code-examples)
10. [Implementation Checklists](#10-implementation-checklists)

---

## 1. Quick Reference

### Critical Rules at a Glance

| Category | Rule | Value |
|----------|------|-------|
| **Contrast** | Text (WCAG AA) | 4.5:1 minimum |
| **Contrast** | Large text/UI elements | 3:1 minimum |
| **Typography** | Base font size | 16px minimum |
| **Typography** | Line height | 1.5× for body text |
| **Typography** | Line length | 45-85 characters |
| **Spacing** | Grid system | 8px base unit |
| **Touch Targets** | Minimum size | 44×44 CSS pixels |
| **Touch Targets** | Material Design | 48×48 dp |
| **Feedback** | Response time | 100-200ms |
| **Animation** | Duration | 200-500ms |
| **Performance** | LCP | < 2.5 seconds |
| **Performance** | CLS | < 0.1 |

### Must-Do Checklist

- [ ] All text meets 4.5:1 contrast ratio
- [ ] All interactive elements are keyboard accessible
- [ ] Touch targets are at least 44×44 pixels
- [ ] All actions provide immediate visual feedback
- [ ] Respect `prefers-reduced-motion` for animations
- [ ] Use semantic HTML before ARIA
- [ ] Mobile-first responsive design
- [ ] Visible focus indicators on all focusable elements

---

## 2. Visual Design Principles

### 2.1 Color Theory & Accessibility

#### Contrast Requirements (WCAG)

| Level | Normal Text | Large Text (18pt+) | UI Components |
|-------|-------------|-------------------|---------------|
| AA (Minimum) | 4.5:1 | 3:1 | 3:1 |
| AAA (Enhanced) | 7:1 | 4.5:1 | 4.5:1 |

**Critical:** Color contrast is the #1 accessibility violation (83.6% of websites fail).

#### Color Usage Rules

```
DO:
✓ Use color AND another indicator (icon, text, pattern)
✓ Test with colorblind simulators (Protanopia, Deuteranopia, Tritanopia)
✓ Provide sufficient contrast in both light and dark modes
✓ Use WebAIM Contrast Checker to validate

DON'T:
✗ Rely solely on color to convey information
✗ Use red/green combinations as only differentiator
✗ Use pure black (#000000) on pure white (#FFFFFF) - causes eye strain
```

#### Dark Mode Palette

```
Background: #121212 (not pure black)
Surface:    #1E1E1E
Text:       #E0E0E0 (not pure white)
Muted:      #9E9E9E
```

### 2.2 Typography Hierarchy

#### Type Scale

Use a consistent ratio (1.2 or 1.25) between heading levels:

```css
/* Base: 16px, Ratio: 1.25 */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.25rem;   /* 20px */
--text-xl:   1.563rem;  /* 25px */
--text-2xl:  1.953rem;  /* 31px */
--text-3xl:  2.441rem;  /* 39px */
--text-4xl:  3.052rem;  /* 49px */
```

#### Readability Guidelines

| Property | Recommendation | Why |
|----------|---------------|-----|
| Base size | 16px minimum | Below 16px causes readability issues |
| Line height | 1.5× body, 1.2× headings | Improves tracking and accuracy |
| Line length | 45-85 characters | Optimal reading comprehension |
| Alignment | Left-aligned (LTR) | Easier for dyslexic readers |
| ALL CAPS | Avoid for body text | Harder to read |

#### Fluid Typography

Use CSS `clamp()` to scale typography fluidly:

```css
h1 { font-size: clamp(2rem, 5vw, 4rem); }
h2 { font-size: clamp(1.5rem, 4vw, 3rem); }
h3 { font-size: clamp(1.25rem, 3vw, 2rem); }
body { font-size: clamp(1rem, 2vw, 1.125rem); }
```

### 2.3 Spacing & Layout (8px Grid)

#### Spacing Scale

```css
--space-1:  8px;
--space-2:  16px;
--space-3:  24px;
--space-4:  32px;
--space-5:  40px;
--space-6:  48px;
--space-7:  56px;
--space-8:  64px;
```

#### Application

| Element | Spacing |
|---------|---------|
| Inline elements | 8px |
| Related elements | 16px |
| Grouped sections | 24px |
| Major sections | 32-48px |
| Page margins | 16-64px (responsive) |

#### Whitespace Strategy

- Use whitespace to separate content groups
- Create visual hierarchy through spacing
- Consistent spacing patterns create predictability
- More whitespace = more perceived importance

### 2.4 Visual Hierarchy

#### Hierarchy Principles

1. **Size:** Larger elements appear more important
2. **Color:** High contrast draws attention
3. **Position:** Top-left (Western) gets priority
4. **Weight:** Bold/saturated elements stand out
5. **Space:** Isolated elements gain importance

#### Z-Index Scale

```css
--z-base:     0;
--z-dropdown: 1000;
--z-sticky:   1100;
--z-fixed:    1200;
--z-modal:    1300;
--z-popover:  1400;
--z-tooltip:  1500;
```

---

## 3. Interaction Design

### 3.1 Feedback & Affordances

#### Feedback Timing

| Action Type | Response Time | User Perception |
|-------------|---------------|-----------------|
| Immediate | 0-100ms | Instantaneous |
| Fast | 100-300ms | Slight delay, acceptable |
| Slow | 300-1000ms | Noticeable, needs indicator |
| Long | 1000ms+ | Requires progress indicator |

#### Affordance Checklist

```
Buttons:
✓ Look clickable (raised, shadowed, contrasting)
✓ Have hover states (desktop)
✓ Have active/pressed states
✓ Show disabled state clearly

Links:
✓ Underlined or distinctly colored
✓ Different color when visited (optional)
✓ Focus state visible

Form inputs:
✓ Clear borders/backgrounds
✓ Focus state visible
✓ Error state distinct (not color-only)
✓ Labels always visible
```

### 3.2 Micro-interactions & Animation

#### Animation Guidelines

| Property | Value | Notes |
|----------|-------|-------|
| Duration | 200-500ms | Noticeable but quick |
| Easing | ease-out, ease-in-out | Natural feel |
| Properties | transform, opacity | Hardware-accelerated |

#### Animation Purposes

1. **Feedback:** Confirm user actions
2. **Orientation:** Show spatial relationships
3. **Guidance:** Direct attention
4. **Delight:** Add personality (sparingly)

#### Accessibility Requirements

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3.3 Touch Targets & Click Areas

#### Size Requirements

| Standard | Minimum Size | Recommended |
|----------|-------------|-------------|
| WCAG 2.5.8 | 24×24 CSS px | - |
| Apple iOS | 44×44 points | 44×44 points |
| Material Design | 48×48 dp | 48×48 dp |

#### Implementation

```css
/* Visual: 24px, Touch target: 48px */
.icon-button {
  width: 24px;
  height: 24px;
  padding: 12px;
  /* Total: 48×48 clickable area */
}
```

#### Spacing Between Targets

- Minimum 8px between touch targets
- Recommended 16px for comfortable use
- Consider users with motor impairments

### 3.4 Loading States

#### Loading UI Types

| Type | When to Use | Duration |
|------|-------------|----------|
| Spinner | Very short waits | < 1 second |
| Skeleton screen | Page/section loads | 1-5 seconds |
| Progress bar | Determinate progress | Any |
| Optimistic UI | Form submissions | Immediate |

#### Skeleton Screen Benefits

- Users perceive 20% faster load times vs spinners
- Maintains layout stability (no CLS)
- Sets expectations for content structure

#### Skeleton Rules

1. Match exact final layout
2. Use subtle animation (shimmer/pulse)
3. Don't show too long (> 5 seconds feels broken)
4. Replace progressively as content loads

---

## 4. Information Architecture

### 4.1 Navigation Patterns

#### Primary Navigation Types

| Pattern | Use Case | Accessibility |
|---------|----------|---------------|
| Top nav | < 7 items, desktop | Keyboard accessible |
| Side nav | Many items, complex hierarchy | Collapsible, keyboard |
| Bottom nav | Mobile, 3-5 primary actions | Touch targets 48px |
| Hamburger | Mobile, secondary nav | Always provide label |

#### Navigation Accessibility

```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

Required:
- Skip-to-main-content link
- Keyboard navigable
- Current page indicator (`aria-current="page"`)
- Logical focus order

### 4.2 Progressive Disclosure

#### When to Use

- Complex forms with many fields
- Advanced settings/options
- Detailed information that most users don't need
- Mobile interfaces with limited space

#### Implementation Patterns

| Pattern | Example | Interaction |
|---------|---------|-------------|
| Accordion | FAQ sections | Click to expand |
| Tabs | Settings categories | Click to switch |
| Tooltip | Help text | Hover/focus |
| Modal | Detailed forms | Click to open |
| "Show more" | Long lists | Click to reveal |

#### Best Practices

```
DO:
✓ Show essential information by default
✓ Make it clear more content is available
✓ Maintain context when expanding
✓ Allow collapse/close action

DON'T:
✗ Hide critical information
✗ Use for primary actions
✗ Create too many levels of disclosure
✗ Hide navigation behind progressive disclosure
```

### 4.3 Search & Filtering

#### Search Best Practices

- Make search immediately visible
- Provide autocomplete suggestions
- Support typo tolerance
- Show recent searches
- Display clear "no results" state with suggestions

#### Filter Guidelines

- Show active filters prominently
- Display result counts per filter
- Allow multi-select where logical
- Provide "clear all" option
- Remember filter preferences (session)

---

## 5. Accessibility (WCAG)

### 5.1 Keyboard Navigation

#### Required Keyboard Support

| Key | Action |
|-----|--------|
| Tab | Move to next focusable element |
| Shift+Tab | Move to previous focusable element |
| Enter | Activate buttons/links |
| Space | Activate buttons, toggle checkboxes |
| Escape | Close modals, cancel actions |
| Arrow keys | Navigate within components (tabs, menus) |

#### Focus Management Rules

1. All interactive elements must be focusable
2. Focus order must match visual order
3. Focus must be visible at all times
4. No keyboard traps (user can always navigate away)
5. Focus returns to trigger after modal closes

#### Implementation

```html
<!-- Semantic HTML (automatically focusable) -->
<button>Click me</button>
<a href="/page">Link</a>
<input type="text">

<!-- Custom elements (need tabindex) -->
<div role="button" tabindex="0">Custom button</div>
```

### 5.2 Screen Reader Support

#### Semantic HTML Priority

Always prefer semantic HTML over ARIA:

```html
<!-- Good: Semantic HTML -->
<button>Submit</button>
<nav>...</nav>
<main>...</main>
<header>...</header>

<!-- Avoid: ARIA on non-semantic elements -->
<div role="button">Submit</div>
<div role="navigation">...</div>
```

#### ARIA When Necessary

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `aria-label` | Provide label for icon-only elements | `<button aria-label="Close">×</button>` |
| `aria-labelledby` | Reference visible label | `<div aria-labelledby="heading-id">` |
| `aria-describedby` | Additional description | `<input aria-describedby="help-text">` |
| `aria-expanded` | Toggle state | `<button aria-expanded="false">` |
| `aria-hidden` | Hide decorative elements | `<span aria-hidden="true">🎉</span>` |
| `aria-live` | Announce dynamic changes | `<div aria-live="polite">` |

#### Live Regions

```html
<!-- Polite: Announces when convenient -->
<div aria-live="polite" aria-atomic="true">
  3 items in cart
</div>

<!-- Assertive: Announces immediately (errors) -->
<div aria-live="assertive" role="alert">
  Error: Invalid email address
</div>
```

### 5.3 Focus Indicators

#### Requirements

- Never remove focus outlines
- Minimum 2px outline
- Must contrast with background
- Must be visible on all interactive elements

```css
/* Good focus styles */
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Never do this */
:focus {
  outline: none; /* ACCESSIBILITY VIOLATION */
}
```

### 5.4 Color Blindness Considerations

#### Don't Rely on Color Alone

```html
<!-- Bad: Color only -->
<span style="color: red;">Error</span>

<!-- Good: Color + icon + text -->
<span style="color: red;">
  <svg aria-hidden="true"><!-- error icon --></svg>
  Error: Password is required
</span>
```

#### Common Color Blindness Types

| Type | Affected Colors | Prevalence |
|------|-----------------|------------|
| Protanopia | Red-green | 1% male |
| Deuteranopia | Red-green | 6% male |
| Tritanopia | Blue-yellow | 0.01% |

#### Safe Color Combinations

- Blue + Orange
- Blue + Yellow
- Purple + Yellow
- Use patterns/textures as backup

---

## 6. Responsive Design

### 6.1 Mobile-First Approach

#### Why Mobile-First

1. Forces prioritization of essential content
2. Smaller initial CSS payload
3. Progressive enhancement is easier
4. Better mobile performance
5. SEO benefits (mobile-first indexing)

#### Implementation

```css
/* Mobile-first: Base styles for mobile */
.container {
  padding: 16px;
  font-size: 16px;
}

/* Then enhance for larger screens */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 720px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 960px;
  }
}
```

### 6.2 Breakpoint Strategy

#### Common Breakpoints

| Name | Width | Target |
|------|-------|--------|
| xs | 0-479px | Small phones |
| sm | 480-767px | Large phones |
| md | 768-1023px | Tablets |
| lg | 1024-1279px | Small laptops |
| xl | 1280-1439px | Desktops |
| 2xl | 1440px+ | Large screens |

#### Using em Units (Recommended)

```css
/* More accessible - respects user font size */
@media (min-width: 48em) { /* 768px at 16px base */ }
@media (min-width: 64em) { /* 1024px at 16px base */ }
@media (min-width: 80em) { /* 1280px at 16px base */ }
```

### 6.3 Fluid Typography & Spacing

#### Fluid Typography

```css
:root {
  /* Fluid type scale */
  --text-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.25rem, 1rem + 1vw, 1.5rem);
  --text-xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
  --text-2xl: clamp(2rem, 1.5rem + 2.5vw, 3rem);
  --text-3xl: clamp(2.5rem, 2rem + 3vw, 4rem);
}
```

#### Fluid Spacing

```css
:root {
  --space-sm: clamp(0.5rem, 0.4rem + 0.5vw, 1rem);
  --space-md: clamp(1rem, 0.8rem + 1vw, 2rem);
  --space-lg: clamp(2rem, 1.5rem + 2vw, 4rem);
  --space-xl: clamp(4rem, 3rem + 4vw, 8rem);
}
```

### 6.4 Touch vs Mouse Detection

#### CSS Detection

```css
/* Devices with hover capability (mouse) */
@media (hover: hover) and (pointer: fine) {
  .button:hover {
    background-color: var(--hover-color);
  }
}

/* Touch devices */
@media (hover: none) and (pointer: coarse) {
  .button {
    /* Larger touch targets, no hover effects */
    min-height: 48px;
  }
}
```

#### JavaScript Detection

```javascript
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
const hasHover = window.matchMedia('(hover: hover)').matches;
```

---

## 7. Performance UX

### 7.1 Perceived Performance

#### Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | ≤ 4s | > 4s |
| FID (First Input Delay) | ≤ 100ms | ≤ 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

#### Perception Optimization

1. **Skeleton screens** - Show structure immediately
2. **Progressive loading** - Load critical content first
3. **Optimistic updates** - Show success before confirmation
4. **Lazy loading** - Defer non-critical resources

### 7.2 Optimistic UI Updates

#### Pattern

```javascript
// 1. Update UI immediately (optimistic)
setItems([...items, newItem]);
showSuccessMessage();

// 2. Send request to server
try {
  await api.addItem(newItem);
  // Success: UI already shows correct state
} catch (error) {
  // 3. Rollback on failure
  setItems(items);
  showErrorMessage('Failed to add item. Please try again.');
}
```

#### When to Use

- Form submissions
- Toggle actions (like/unlike)
- Adding/removing items
- Any action where failure is rare

#### When NOT to Use

- Destructive actions (delete)
- Payment processing
- Actions with side effects

### 7.3 Error Handling

#### Error Message Guidelines

```
DO:
✓ Explain what went wrong in plain language
✓ Tell user how to fix it
✓ Provide recovery options (retry, cancel, alternative)
✓ Keep error visible until resolved
✓ Use appropriate severity (error vs warning)

DON'T:
✗ Use technical jargon or error codes
✗ Blame the user
✗ Show generic "Something went wrong"
✗ Auto-dismiss important errors
```

#### Error Display Pattern

```html
<div role="alert" class="error-message">
  <svg aria-hidden="true"><!-- error icon --></svg>
  <div>
    <strong>Unable to save changes</strong>
    <p>Check your internet connection and try again.</p>
  </div>
  <button>Retry</button>
</div>
```

### 7.4 Offline States

#### Offline UX Requirements

1. Indicate when user is offline
2. Show what content is available offline
3. Queue actions for later sync
4. Notify when back online
5. Sync queued actions automatically

```javascript
// Listen for online/offline status
window.addEventListener('online', () => {
  showNotification('Back online. Syncing changes...');
  syncQueuedActions();
});

window.addEventListener('offline', () => {
  showNotification('You are offline. Changes will sync when connected.');
});
```

---

## 8. Modern Patterns (2025)

### 8.1 Dark Mode Implementation

#### CSS Implementation

```css
:root {
  /* Light mode (default) */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode */
    --bg-primary: #121212;
    --bg-secondary: #1e1e1e;
    --text-primary: #e0e0e0;
    --text-secondary: #9e9e9e;
  }
}

/* Manual toggle support */
[data-theme="dark"] {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --text-primary: #e0e0e0;
  --text-secondary: #9e9e9e;
}
```

#### Dark Mode Rules

```
DO:
✓ Use #121212 for backgrounds (not pure black)
✓ Use #E0E0E0 for text (not pure white)
✓ Maintain WCAG contrast in both modes
✓ Respect system preference by default
✓ Allow manual override
✓ Persist user preference

DON'T:
✗ Force dark mode on users
✗ Use pure black (#000000) backgrounds
✗ Forget to test contrast in dark mode
✗ Change images/icons without adjustment
```

### 8.2 Design Tokens

#### Token Structure

```json
{
  "color": {
    "primary": {
      "50": { "value": "#e3f2fd" },
      "100": { "value": "#bbdefb" },
      "500": { "value": "#2196f3" },
      "900": { "value": "#0d47a1" }
    },
    "semantic": {
      "success": { "value": "{color.green.500}" },
      "error": { "value": "{color.red.500}" },
      "warning": { "value": "{color.yellow.500}" }
    }
  },
  "spacing": {
    "xs": { "value": "4px" },
    "sm": { "value": "8px" },
    "md": { "value": "16px" },
    "lg": { "value": "24px" },
    "xl": { "value": "32px" }
  },
  "typography": {
    "fontSize": {
      "sm": { "value": "14px" },
      "base": { "value": "16px" },
      "lg": { "value": "18px" }
    }
  }
}
```

#### Benefits

- Consistent design across platforms
- Easy theme switching
- Single source of truth
- Automated design-to-code workflow

### 8.3 AI-Assisted Interfaces

#### Design Principles

```
DO:
✓ Make AI assistance opt-in initially
✓ Clearly indicate when AI is providing suggestions
✓ Show confidence levels for predictions
✓ Provide "explain why" transparency
✓ Allow easy override of AI suggestions
✓ Maintain user control at all times

DON'T:
✗ Make AI decisions without user awareness
✗ Hide AI involvement
✗ Make AI suggestions feel mandatory
✗ Remove user agency
```

#### AI UI Patterns

- Suggestion chips (accept/reject)
- Inline autocomplete with Tab to accept
- Side panel with AI recommendations
- Confidence indicators (high/medium/low)
- "Why this suggestion?" explanations

### 8.4 Component Library Structure

#### Recommended Component Categories

```
components/
├── primitives/           # Basic building blocks
│   ├── Button/
│   ├── Input/
│   ├── Text/
│   └── Icon/
├── forms/               # Form-specific components
│   ├── TextField/
│   ├── Select/
│   ├── Checkbox/
│   └── FormField/
├── feedback/            # User feedback components
│   ├── Alert/
│   ├── Toast/
│   ├── Skeleton/
│   └── Progress/
├── navigation/          # Navigation components
│   ├── Navbar/
│   ├── Sidebar/
│   ├── Tabs/
│   └── Breadcrumb/
├── overlay/             # Overlay components
│   ├── Modal/
│   ├── Popover/
│   ├── Tooltip/
│   └── Dropdown/
└── layout/              # Layout components
    ├── Container/
    ├── Grid/
    ├── Stack/
    └── Card/
```

---

## 9. Code Examples

### 9.1 Framework-Agnostic CSS/HTML

#### Accessible Button

```html
<button
  class="button button--primary"
  type="button"
>
  Save Changes
</button>

<style>
.button {
  /* Touch target */
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;

  /* Visual */
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  /* Transitions */
  transition: background-color 200ms ease-out,
              transform 100ms ease-out;
}

.button--primary {
  background-color: #2196f3;
  color: white;
}

.button:hover {
  background-color: #1976d2;
}

.button:active {
  transform: scale(0.98);
}

.button:focus-visible {
  outline: 2px solid #2196f3;
  outline-offset: 2px;
}

.button:disabled {
  background-color: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}
</style>
```

#### Skeleton Loading

```html
<div class="skeleton-card">
  <div class="skeleton skeleton--image"></div>
  <div class="skeleton skeleton--title"></div>
  <div class="skeleton skeleton--text"></div>
  <div class="skeleton skeleton--text skeleton--short"></div>
</div>

<style>
.skeleton {
  background: linear-gradient(
    90deg,
    #e0e0e0 25%,
    #f5f5f5 50%,
    #e0e0e0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton--image {
  width: 100%;
  height: 200px;
  margin-bottom: 16px;
}

.skeleton--title {
  width: 70%;
  height: 24px;
  margin-bottom: 12px;
}

.skeleton--text {
  width: 100%;
  height: 16px;
  margin-bottom: 8px;
}

.skeleton--short {
  width: 40%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background: #e0e0e0;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .skeleton {
    background: linear-gradient(
      90deg,
      #2a2a2a 25%,
      #3a3a3a 50%,
      #2a2a2a 75%
    );
    background-size: 200% 100%;
  }
}
</style>
```

#### Form Field with Error

```html
<div class="form-field form-field--error">
  <label for="email" class="form-field__label">
    Email address
    <span class="form-field__required" aria-hidden="true">*</span>
  </label>
  <input
    type="email"
    id="email"
    class="form-field__input"
    aria-describedby="email-error"
    aria-invalid="true"
    required
  >
  <div id="email-error" class="form-field__error" role="alert">
    <svg aria-hidden="true" class="form-field__error-icon">
      <!-- error icon -->
    </svg>
    Please enter a valid email address
  </div>
</div>

<style>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field__label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-field__required {
  color: #d32f2f;
  margin-left: 4px;
}

.form-field__input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms;
}

.form-field__input:focus {
  outline: none;
  border-color: #2196f3;
}

.form-field--error .form-field__input {
  border-color: #d32f2f;
}

.form-field__error {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d32f2f;
  font-size: 14px;
}

.form-field__error-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
</style>
```

### 9.2 React/Next.js Patterns

#### Accessible Button Component

```tsx
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center font-medium',
          'rounded-lg transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-offset-2 focus-visible:ring-blue-500',
          // Touch target minimum
          'min-h-[44px] min-w-[44px]',
          // Size variants
          {
            'px-3 py-2 text-sm': size === 'sm',
            'px-4 py-2.5 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          // Color variants
          {
            'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
            'bg-transparent text-gray-700 hover:bg-gray-100': variant === 'ghost',
          },
          // Disabled state
          {
            'opacity-50 cursor-not-allowed': isDisabled,
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### useReducedMotion Hook

```tsx
import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// Usage
function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ x: 100 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.3,
      }}
    />
  );
}
```

#### useDarkMode Hook

```tsx
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useDarkMode() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Get stored preference or default to system
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();
    mediaQuery.addEventListener('change', updateResolvedTheme);

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme]);

  useEffect(() => {
    // Apply to document
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
  };
}
```

#### Optimistic Update with React Query

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export function useTodoToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todo: Todo) =>
      fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !todo.completed }),
      }).then((res) => res.json()),

    // Optimistic update
    onMutate: async (todo) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // Optimistically update
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        )
      );

      return { previousTodos };
    },

    // Rollback on error
    onError: (err, todo, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos);
      toast.error('Failed to update todo. Please try again.');
    },

    // Refetch on success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
```

#### Skeleton Component

```tsx
import { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        'bg-gray-200 dark:bg-gray-700',
        {
          'rounded': variant === 'text',
          'rounded-full': variant === 'circular',
          'rounded-lg': variant === 'rectangular',
          'animate-pulse': animation === 'pulse',
          'animate-shimmer': animation === 'wave',
          'h-4': variant === 'text' && !height,
        },
        'motion-reduce:animate-none',
        className
      )}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

// Card skeleton example
export function CardSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" width="70%" height={24} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}
```

### 9.3 Tailwind CSS Examples

#### Button Variants

```tsx
// Tailwind button component
const buttonVariants = {
  base: `
    inline-flex items-center justify-center
    min-h-11 min-w-11 px-4 py-2
    font-medium rounded-lg
    transition-colors duration-200
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-offset-2 focus-visible:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

// Usage
<button className={`${buttonVariants.base} ${buttonVariants.primary}`}>
  Primary Button
</button>
```

#### Form Input with Tailwind

```tsx
<div className="space-y-2">
  <label
    htmlFor="email"
    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    Email address
    <span className="text-red-500 ml-1" aria-hidden="true">*</span>
  </label>

  <input
    type="email"
    id="email"
    className={`
      w-full px-4 py-3
      border-2 rounded-lg
      text-base
      transition-colors duration-200
      focus:outline-none focus:ring-0
      ${hasError
        ? 'border-red-500 focus:border-red-500'
        : 'border-gray-300 focus:border-blue-500 dark:border-gray-600'
      }
      dark:bg-gray-800 dark:text-white
    `}
    aria-describedby={hasError ? 'email-error' : undefined}
    aria-invalid={hasError}
    required
  />

  {hasError && (
    <p
      id="email-error"
      role="alert"
      className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
    >
      <ErrorIcon className="w-4 h-4" aria-hidden="true" />
      Please enter a valid email address
    </p>
  )}
</div>
```

#### Responsive Layout

```tsx
<div className="
  container mx-auto
  px-4 sm:px-6 lg:px-8
  py-8 sm:py-12 lg:py-16
">
  {/* Responsive grid */}
  <div className="
    grid gap-6
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
  ">
    {items.map(item => (
      <Card key={item.id} {...item} />
    ))}
  </div>
</div>
```

#### Dark Mode Components

```tsx
// Card with dark mode
<div className="
  bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  rounded-xl shadow-sm
  p-6
">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    Card Title
  </h2>
  <p className="mt-2 text-gray-600 dark:text-gray-400">
    Card description text goes here.
  </p>
</div>

// Badge with dark mode
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  rounded-full text-xs font-medium
  bg-blue-100 text-blue-800
  dark:bg-blue-900 dark:text-blue-200
">
  Badge
</span>
```

#### Animation with Reduced Motion

```tsx
// Tailwind config addition
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
};

// Component with motion-reduce
<div className="
  animate-shimmer
  motion-reduce:animate-none
  bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
  dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
  bg-[length:200%_100%]
  rounded
  h-4 w-full
"/>
```

---

## 10. Implementation Checklists

### Phase 1: Planning & Setup

- [ ] Define accessibility requirements (WCAG AA minimum)
- [ ] Establish color palette with dark mode variants
- [ ] Create typography scale (1.25 ratio recommended)
- [ ] Define spacing scale (8px base)
- [ ] Set up design tokens
- [ ] Choose component library or create component structure

### Phase 2: Visual Design

- [ ] Test all color combinations for 4.5:1 contrast ratio
- [ ] Implement light and dark mode palettes
- [ ] Set up fluid typography with clamp()
- [ ] Apply 8px grid spacing consistently
- [ ] Create visual hierarchy (size, color, position)
- [ ] Design consistent iconography

### Phase 3: Interaction Design

- [ ] Add hover/focus states to all interactive elements
- [ ] Implement loading states (skeleton screens)
- [ ] Ensure all touch targets are ≥ 44×44px
- [ ] Add micro-interactions (200-500ms duration)
- [ ] Implement form validation with clear error messages
- [ ] Add success/error feedback for all actions

### Phase 4: Accessibility

- [ ] Use semantic HTML elements
- [ ] Add skip-to-content link
- [ ] Ensure all images have alt text
- [ ] Implement keyboard navigation for all interactive elements
- [ ] Add visible focus indicators (never remove outline)
- [ ] Associate all form labels with inputs
- [ ] Add ARIA labels for icon-only buttons
- [ ] Implement aria-live regions for dynamic content
- [ ] Test color blindness with simulators

### Phase 5: Responsive Design

- [ ] Implement mobile-first CSS
- [ ] Add appropriate breakpoints (em units preferred)
- [ ] Use fluid typography and spacing
- [ ] Test touch targets on mobile (≥ 44px)
- [ ] Remove hover-dependent interactions on touch devices
- [ ] Test on real devices (iOS, Android)

### Phase 6: Performance

- [ ] Implement skeleton screens for loading states
- [ ] Add optimistic UI updates where appropriate
- [ ] Lazy load images and non-critical resources
- [ ] Minimize layout shifts (CLS < 0.1)
- [ ] Test Core Web Vitals (LCP < 2.5s, FID < 100ms)

### Phase 7: Testing & QA

- [ ] Test keyboard navigation (Tab, Enter, Escape, Arrows)
- [ ] Test with screen reader (NVDA, VoiceOver)
- [ ] Validate contrast ratios (WebAIM checker)
- [ ] Run Lighthouse accessibility audit (score > 90)
- [ ] Test reduced motion preference
- [ ] Test dark mode appearance
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Test on various screen sizes

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    UI/UX QUICK REFERENCE                     │
├─────────────────────────────────────────────────────────────┤
│ CONTRAST      │ Text: 4.5:1 │ Large/UI: 3:1 │ AAA: 7:1      │
│ TYPOGRAPHY    │ Base: 16px  │ Line: 1.5×    │ Width: 45-85ch│
│ SPACING       │ Grid: 8px   │ Multiples: 8,16,24,32,40,48   │
│ TOUCH TARGET  │ Min: 44×44  │ Material: 48×48dp              │
│ ANIMATION     │ Duration: 200-500ms │ Respect reduced motion │
│ PERFORMANCE   │ LCP: <2.5s  │ FID: <100ms   │ CLS: <0.1     │
├─────────────────────────────────────────────────────────────┤
│ ACCESSIBILITY MUST-HAVES                                     │
│ ✓ Keyboard accessible    ✓ Screen reader tested             │
│ ✓ Visible focus states   ✓ Semantic HTML                    │
│ ✓ Color not sole indicator ✓ Alt text on images             │
├─────────────────────────────────────────────────────────────┤
│ DARK MODE                                                    │
│ Background: #121212 (not #000000)                           │
│ Text: #E0E0E0 (not #FFFFFF)                                 │
│ Always allow user control                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Resources

### Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Color Blind Simulator](https://coolors.co/color-blindness-simulator)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/)

### Guidelines

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design 3](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Nielsen Norman Group](https://www.nngroup.com/)

### Testing

- [NVDA Screen Reader](https://www.nvaccess.org/)
- [VoiceOver (macOS)](https://support.apple.com/guide/voiceover/welcome/mac)
- [Accessibility Insights](https://accessibilityinsights.io/)

---

*Last updated: January 2025*
*Based on WCAG 2.1/2.2, Material Design 3, Apple HIG, and industry best practices.*
