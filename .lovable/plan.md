

# ZAKA — AI Agent Infrastructure Landing Page

## Overview
A cinematic, dark-mode-dominant landing page for ZAKA, an AI Agent Infrastructure company. The experience will feel like a next-gen AI control room — controlled, intelligent, and intentional. Includes a lead capture form powered by Supabase.

---

## Design System

- **Palette**: Midnight (#0E1116), Moss AI (#2E4036), Electric Clay (#CC5833), Soft Bone (#F2F0E9), Deep Charcoal (#1A1A1A)
- **Typography**: Plus Jakarta Sans + Outfit for headings, Cormorant Garamond Italic for conceptual phrases, JetBrains Mono for data/system UI
- **Texture**: Subtle SVG turbulence noise overlay, all containers with generous rounding (2rem–3rem), no sharp edges
- **Animations**: GSAP + ScrollTrigger throughout — stagger reveals, parallax, magnetic hovers, typewriter effects

---

## Sections (Top to Bottom)

### 1. Navbar — "The Control Capsule"
- Fixed pill-shaped container with transparent → glassmorphic scroll transition
- Links: Agents, Enterprise, Infrastructure, Deploy
- Magnetic hover micro-interactions on links

### 2. Hero — "Autonomous Intelligence"
- Full viewport height, dark neural infrastructure background (real Unsplash image)
- Bottom-left aligned massive typography: "AI Agents" (sans bold) + "that operate autonomously." (serif italic)
- Two CTAs: "Deploy Your Agent" (primary) + "View Architecture" (secondary)
- GSAP stagger fade-up entrance animation

### 3. Features — "Agent Infrastructure Console"
Three interactive AI module cards:
- **Voice Agent Console**: Animated SVG waveform, pulsing "Listening…" indicator, typewriter transcript, latency metric
- **Chat Agent Engine**: Rotating response cards (Intent Detection → Context Memory → Action Trigger) with spring-bounce animation every 3 seconds
- **Automation Protocol**: Animated SVG cursor moving between workflow nodes, triggering actions like "Lead Captured"

### 4. Philosophy — "The Infrastructure Manifesto"
- Full charcoal section with high-contrast typography
- Contrasts traditional AI ("What did the user type?") vs ZAKA ("What action should the system execute?")
- GSAP text reveal animation with subtle parallax grid overlay

### 5. Protocol Stack — "Layered Intelligence"
- 3 full-screen stacked cards with ScrollTrigger stacking logic
- Previous cards scale down, blur, and fade as new ones enter
- Each card contains animated visuals: neural node mesh, scanning grid, live performance graph

### 6. Deployment Tiers
- 3-tier pricing grid: Starter, Growth, Performance (highlighted)
- Middle card with Moss background, Clay CTA, subtle glow
- CTA: "Deploy Infrastructure"

### 7. Contact / Deploy Form
- Lead capture form (name, email, company, message) stored in Supabase
- Styled to match the dark system terminal aesthetic
- Input validation with Zod

### 8. Footer — "System Terminal"
- Deep Charcoal with rounded top corners (4rem)
- Column links: Agents, Enterprise, API, Security, Documentation
- System status indicator: "● System Operational" with pulsing green dot

---

## Technical Approach
- **GSAP 3 + ScrollTrigger** for all scroll-driven and entrance animations, with proper `gsap.context()` cleanup
- **Supabase** (Lovable Cloud) for lead capture form backend
- **Google Fonts** for Plus Jakarta Sans, Outfit, Cormorant Garamond, JetBrains Mono
- Real Unsplash image URLs throughout — no placeholders

