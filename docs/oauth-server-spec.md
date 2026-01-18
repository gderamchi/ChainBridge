# OAuth Server Authorization Endpoint Specification

## Overview

ChainBridge will act as an OAuth 2.1 identity provider, allowing third-party applications (including AI agents/MCP clients) to authenticate users via Supabase OAuth Server.

---

## 1. OAuth 2.1 Configuration

### 1.1 Supabase OAuth Endpoints

| Endpoint | URL |
|----------|-----|
| Authorization endpoint | `https://kpnelxrnimybkmrhsogh.supabase.co/auth/v1/oauth/authorize` |
| Token endpoint | `https://kpnelxrnimybkmrhsogh.supabase.co/auth/v1/oauth/token` |
| JWKS endpoint | `https://kpnelxrnimybkmrhsogh.supabase.co/auth/v1/.well-known/jwks.json` |

### 1.2 Application Configuration

| Setting | Value |
|---------|-------|
| Authorization Path | `/oauth/consent` |
| Site URL | `http://localhost:3000` (dev) / Production URL |
| Full Authorization URL | `{Site URL}/oauth/consent` |

---

## 2. Authorization Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Third-party    │     │  Supabase Auth  │     │  ChainBridge    │
│  Application    │     │  OAuth Server   │     │  /oauth/consent │
│                 │     │                 │     │                 │
│  Initiates      │────▶│  Redirects      │────▶│  Consent Page   │
│  OAuth Flow     │     │  with auth_id   │     │  (User decides) │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
┌─────────────────┐     ┌─────────────────┐              │
│  Third-party    │◀────│  Supabase Auth  │◀─────────────┘
│  Callback       │     │  Returns code   │   Approve/Deny
└─────────────────┘     └─────────────────┘
```

### 2.1 Flow Steps

1. **Third-party initiates OAuth** → Redirects to Supabase authorization endpoint
2. **Supabase Auth** → Redirects user to `/oauth/consent?authorization_id=<id>`
3. **ChainBridge checks auth** → If not logged in, redirect to `/portal/login` (preserving `authorization_id`)
4. **Consent Page** → Shows client details, requested scopes
5. **User decision** → Approve or Deny
6. **Handle decision** → Call `approveAuthorization()` or `denyAuthorization()`
7. **Redirect back** → User returns to third-party app with auth code or error

---

## 3. Routes

| Route | Type | Purpose |
|-------|------|---------|
| `/oauth/consent` | Page | Consent UI - displays authorization request |
| `/api/oauth/decision` | API Route | Handles approve/deny form submission |

---

## 4. Consent Page (`/oauth/consent`)

### 4.1 Requirements

- Extract `authorization_id` from query params
- Check if user is authenticated (redirect to login if not)
- Fetch authorization details via `supabase.auth.oauth.getAuthorizationDetails()`
- Display client name, redirect URI, and requested scopes
- Provide Approve and Deny buttons

### 4.2 UI Elements

- ChainBridge branding (consistent with portal design)
- Client application name
- Redirect URI (for transparency)
- List of requested scopes/permissions
- Approve button (gold primary style)
- Deny button (outline style)
- Loading state while fetching details
- Error handling for invalid/expired authorization_id

### 4.3 Styling

Consistent with ChainBridge design system:
- Background: `bg-slate-dark`
- Panel: `glass-panel-luxury`
- Approve Button: `bg-gold-primary hover:bg-[#D4AF67] text-slate-900`
- Deny Button: `border border-white/10 hover:border-gold-primary text-white`
- Text: `text-white`, `text-text-muted`
- Typography: `font-serif` for headings

---

## 5. Decision API Route (`/api/oauth/decision`)

### 5.1 Request

- **Method**: POST
- **Content-Type**: `application/x-www-form-urlencoded` (form data)
- **Fields**:
  - `authorization_id`: string (required)
  - `decision`: `"approve"` | `"deny"` (required)

### 5.2 Logic

```typescript
if (decision === 'approve') {
  const { data, error } = await supabase.auth.oauth.approveAuthorization(authorizationId)
  if (!error) redirect(data.redirect_to)
} else {
  const { data, error } = await supabase.auth.oauth.denyAuthorization(authorizationId)
  if (!error) redirect(data.redirect_to)
}
```

### 5.3 Response

- Success: Redirect to `data.redirect_to` (back to third-party app)
- Error: Return JSON error response with status 400

---

## 6. Authentication Integration

When user is not logged in:
1. Redirect to `/portal/login?redirect=/oauth/consent?authorization_id={id}`
2. After successful magic link auth, redirect back to consent page
3. This requires updating the login flow to handle `redirect` query param

---

## 7. Supabase Dashboard Configuration

### Required Steps (Manual)

1. **Enable OAuth 2.1 Server**: Authentication > OAuth Server > Enable
2. **Set Authorization Path**: `/oauth/consent`
3. **Verify Site URL**: Authentication > URL Configuration > Confirm Site URL

### Optional (Recommended)

- Switch to asymmetric JWT signing (RS256/ES256) if using OpenID Connect
- Register OAuth clients for testing

---

## 8. Error Handling

| Error | User Message | Action |
|-------|--------------|--------|
| Missing authorization_id | "Invalid authorization request" | Show error page |
| Invalid authorization_id | "Authorization request not found or expired" | Show error + link home |
| User not authenticated | N/A | Redirect to login |
| API error on approve/deny | "Failed to process request" | Show error + retry |

---

## 9. Security Considerations

- Authorization IDs are single-use and expire
- Always validate user session before showing consent
- HTTPS required in production
- Redirect URIs are strictly validated by Supabase

---

## 10. Dependencies

Uses existing Supabase client utilities:
- `lib/supabase/server.ts` for server-side operations
- `@supabase/ssr` already installed

New Supabase Auth OAuth methods:
- `supabase.auth.oauth.getAuthorizationDetails()`
- `supabase.auth.oauth.approveAuthorization()`
- `supabase.auth.oauth.denyAuthorization()`

---

## 11. File Structure

```
app/
├── oauth/
│   └── consent/
│       └── page.tsx          # Consent UI page
├── api/
│   └── oauth/
│       └── decision/
│           └── route.ts      # Approve/Deny handler
```
