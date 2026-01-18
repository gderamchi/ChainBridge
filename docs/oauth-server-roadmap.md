# OAuth Server Authorization Endpoint - Roadmap

## Phase 1: Supabase Configuration
- [ ] Enable OAuth 2.1 Server in Supabase Dashboard (Authentication > OAuth Server)
- [ ] Set Authorization Path to `/oauth/consent`
- [ ] Verify Site URL is correct in URL Configuration

## Phase 2: Consent Page Implementation
- [ ] Create `/oauth/consent` page
  - [ ] Extract `authorization_id` from query params
  - [ ] Check user authentication (redirect to login if needed)
  - [ ] Fetch authorization details via `getAuthorizationDetails()`
  - [ ] Display client info and scopes
  - [ ] Style consistent with ChainBridge design
- [ ] Handle error states (missing/invalid authorization_id)

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
