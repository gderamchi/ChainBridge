# Client Portal Development Roadmap

## Project Overview

**Feature**: ChainBridge Client Portal with Magic Link Authentication  
**Start Date**: January 2026  
**Target MVP Completion**: Q1 2026

---

## Phase 1: Foundation & Setup
**Duration**: 1-2 days  
**Status**: � In Progress

### Tasks

| # | Task | Priority | Est. Time | Dependencies |
|---|------|----------|-----------|--------------|
| 1.1 | Create Supabase project and configure auth settings | High | 30 min | None |
| 1.2 | [x] Install Supabase dependencies (`@supabase/supabase-js`, `@supabase/ssr`) | High | 15 min | 1.1 |
| 1.3 | [x] Set up environment variables | High | 15 min | 1.1 |
| 1.4 | [x] Create Supabase client utilities (`lib/supabase/client.ts`, `lib/supabase/server.ts`) | High | 1 hr | 1.2, 1.3 |
| 1.5 | Configure redirect URLs in Supabase dashboard | High | 15 min | 1.1 |
| 1.6 | Configure Email Template in Supabase dashboard | High | 15 min | 1.1 |

### Deliverables
- [x] Supabase project created
- [x] Dependencies installed
- [x] Environment variables configured
- [x] Client utilities created
- [ ] Redirect URLs configured

---

## Phase 2: Authentication Implementation
**Duration**: 2-3 days  
**Status**: � In Progress

### Tasks

| # | Task | Priority | Est. Time | Dependencies |
|---|------|----------|-----------|--------------|
| 2.1 | [x] Create login page UI (`/portal/login`) | High | 3 hrs | Phase 1 |
| 2.2 | [x] Implement magic link sign-in function | High | 1 hr | 1.4 |
| 2.3 | [x] Create auth callback route handler (`/auth/confirm`) | High | 2 hrs | 1.4 |
| 2.4 | [x] Implement sign-out functionality | High | 30 min | 1.4 |
| 2.5 | [x] Add form validation (email format) | Medium | 1 hr | 2.1 |
| 2.6 | [x] Add loading states to login form | Medium | 1 hr | 2.1 |
| 2.7 | [x] Add success/error message display | Medium | 1 hr | 2.1, 2.2 |
| 2.8 | [x] Handle rate limiting errors | Medium | 30 min | 2.2 || 2.9 | Connect Navbar "Client Portal" button | High | 15 min | 2.1 |
### Deliverables
- [x] Login page with email input
- [x] Magic link sending functionality
- [x] Auth callback handler
- [x] Sign-out button/action
- [x] Form validation
- [x] Loading and error states

---

## Phase 3: Route Protection
**Duration**: 1 day  
**Status**: ✅ Completed

### Tasks

| # | Task | Priority | Est. Time | Dependencies |
|---|------|----------|-----------|--------------|
| 3.1 | [x] Create Next.js middleware for auth | High | 2 hrs | Phase 2 |
| 3.2 | [x] Configure protected route patterns | High | 30 min | 3.1 |
| 3.3 | [x] Implement redirect logic for unauthenticated users | High | 1 hr | 3.1 |
| 3.4 | [x] Implement redirect for authenticated users on login page | Medium | 30 min | 3.1 |
| 3.5 | [x] Test session persistence across page refreshes | High | 1 hr | 3.1 |

### Deliverables
- [x] Middleware file (`middleware.ts`)
- [x] Protected routes working
- [x] Session persistence verified
- [x] Auth redirects working correctly

---

## Phase 4: Portal Dashboard (Placeholder)
**Duration**: 1 day  
**Status**: 🔲 Not Started

### Tasks

| # | Task | Priority | Est. Time | Dependencies |
|---|------|----------|-----------|--------------|
| 4.1 | Create portal layout component | High | 1 hr | Phase 3 |
| 4.2 | Create placeholder dashboard page (`/portal`) | High | 2 hrs | 4.1 |
| 4.3 | Display authenticated user info | Medium | 30 min | 4.2 |
| 4.4 | Add sign-out button to portal | High | 30 min | 2.4, 4.2 |
| 4.5 | Add portal navigation link to Navbar | Medium | 30 min | 4.2 |
| 4.6 | Style portal consistent with main site | High | 1 hr | 4.2 |

### Deliverables
- [ ] Portal layout
- [ ] Placeholder dashboard
- [ ] User info display
- [ ] Sign-out functionality
- [ ] Navigation integration

---

## Phase 5: Testing & Polish
**Duration**: 1-2 days  
**Status**: 🔲 Not Started

### Tasks

| # | Task | Priority | Est. Time | Dependencies |
|---|------|----------|-----------|--------------|
| 5.1 | Test complete auth flow (new user) | High | 1 hr | Phase 4 |
| 5.2 | Test complete auth flow (existing user) | High | 1 hr | Phase 4 |
| 5.3 | Test expired magic link handling | Medium | 30 min | Phase 4 |
| 5.4 | Test mobile responsiveness | High | 1 hr | Phase 4 |
| 5.5 | Test error scenarios | Medium | 1 hr | Phase 4 |
| 5.6 | Cross-browser testing | Medium | 1 hr | Phase 4 |
| 5.7 | Accessibility review | Medium | 1 hr | Phase 4 |
| 5.8 | Performance review | Low | 30 min | Phase 4 |

### Deliverables
- [ ] All test cases passed
- [ ] Mobile responsive verified
- [ ] Cross-browser compatible
- [ ] Accessible (basic a11y)

---

## Phase 6: Documentation & Deployment
**Duration**: 0.5 days  
**Status**: 🔲 Not Started

### Tasks

| # | Task | Priority | Est. Time | Dependencies |
|---|------|----------|-----------|--------------|
| 6.1 | Update README with portal documentation | Medium | 30 min | Phase 5 |
| 6.2 | Document environment variables needed | High | 15 min | Phase 5 |
| 6.3 | Configure production Supabase settings | High | 30 min | Phase 5 |
| 6.4 | Deploy to staging | High | 30 min | 6.3 |
| 6.5 | Final QA on staging | High | 1 hr | 6.4 |
| 6.6 | Deploy to production | High | 30 min | 6.5 |

### Deliverables
- [ ] Documentation updated
- [ ] Staging deployment
- [ ] Production deployment

---

## Timeline Summary

```
Week 1
├── Day 1-2: Phase 1 (Foundation & Setup)
├── Day 3-5: Phase 2 (Authentication Implementation)
│
Week 2
├── Day 1: Phase 3 (Route Protection)
├── Day 2: Phase 4 (Portal Dashboard Placeholder)
├── Day 3-4: Phase 5 (Testing & Polish)
├── Day 5: Phase 6 (Documentation & Deployment)
```

**Total Estimated Time**: 6-9 business days

---

## File Structure (To Be Created)

```
app/
├── auth/
│   └── confirm/
│       └── route.ts          # Magic link callback handler
├── portal/
│   ├── layout.tsx            # Portal layout with auth check
│   ├── page.tsx              # Portal dashboard (placeholder)
│   └── login/
│       └── page.tsx          # Magic link login page
lib/
└── supabase/
    ├── client.ts             # Browser Supabase client
    └── server.ts             # Server Supabase client
middleware.ts                  # Route protection middleware
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Supabase email deliverability issues | Medium | High | Test with multiple email providers, monitor Supabase logs |
| Magic link spam/abuse | Low | Medium | Rate limiting configured by default (60s) |
| Session token issues | Low | High | Use official Supabase SSR package |
| Mobile email client link issues | Medium | Medium | Test across popular email clients |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Login flow completion rate | > 90% |
| Magic link delivery time | < 30 seconds |
| Auth callback success rate | > 99% |
| Mobile usability score | > 80% |

---

## Future Phases (Out of Current Scope)

### Phase 7: Enhanced Authentication
- Social OAuth (Google, LinkedIn)
- Email OTP alternative
- Remember device functionality

### Phase 8: User Profile
- Profile editing
- Email change flow
- Account deletion

### Phase 9: Client Portal Features
- Sourcing dashboard
- Order history
- Document management
- Communication center
- Analytics & reporting

### Phase 10: Admin Features
- User management
- Role-based access
- Audit logging
- Client onboarding workflow

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| Jan 18, 2026 | 1.0 | Initial roadmap created | - |

---

## Notes

- All dates are estimates and subject to change based on team availability
- Phases 1-6 represent the MVP with magic link auth only
- Portal dashboard is intentionally a placeholder for this phase
- `shouldCreateUser` is set to `true` to allow new client sign-ups
- Styling must remain consistent with existing ChainBridge design system (slate/gold theme)
