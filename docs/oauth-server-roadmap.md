# OAuth Server Authorization Endpoint - Roadmap

## Phase 1: Supabase Configuration
- [X] Enable OAuth 2.1 Server in Supabase Dashboard (Authentication > OAuth Server)
- [X] Set Authorization Path to `/oauth/consent`
- [X] Verify Site URL is correct in URL Configuration

## Phase 2: Consent Page Implementation
- [x] Create `/oauth/consent` page
  - [x] Extract `authorization_id` from query params
  - [x] Check user authentication (redirect to login if needed)
  - [x] Fetch authorization details via `getAuthorizationDetails()`
  - [x] Display client info and scopes
  - [x] Style consistent with ChainBridge design
- [x] Handle error states (missing/invalid authorization_id)

## Phase 3: Decision API Route
- [ ] Create `/api/oauth/decision` route
  - [ ] Handle POST form submission
  - [ ] Call `approveAuthorization()` on approve
  - [ ] Call `denyAuthorization()` on deny
  - [ ] Redirect to `data.redirect_to`
- [ ] Handle API errors

## Phase 4: Login Redirect Integration
- [ ] Update `/portal/login` to accept `redirect` query param
- [ ] After successful auth, redirect to preserved URL
- [ ] Test full flow: unauthenticated → login → consent → decision
