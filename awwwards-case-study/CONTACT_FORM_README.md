# Contact Form Implementation

## Overview

A fully-featured contact form with progressive steps, validation, GDPR compliance, and spam protection.

## Features

### ✅ UI/UX
- **Split Layout**: Form on left, looping video on right (desktop only)
- **Progressive Form**: Two-step form that reveals additional fields after initial selection
- **Responsive**: Mobile-friendly with video hidden on small screens
- **Accessibility**: Full ARIA labels, keyboard navigation, focus states

### ✅ Form Fields

**Step 1:**
- Name (required)
- Business Email (required, validated)
- Service Selection (required): Branding, Website, Digital Design, Content Creation

**Step 2:**
- Message (required)
- Meeting Preference (optional): Early next week, Later this week, Next month, Not sure
- GDPR Consent (required)

### ✅ Validation
- **Client-side**: Real-time validation with error messages
- **Server-side**: API route validates all fields before sending
- **Email Format**: Regex validation for email addresses

### ✅ GDPR Compliance
- Required consent checkbox
- Link to Privacy Policy page
- Clear data usage notice
- No database persistence (email-only)

### ✅ Spam Protection
- **Honeypot Field**: Hidden field to catch bots
- **Rate Limiting**: 5 submissions per hour per IP address
- Server-side validation

### ✅ Email Integration
- Uses Resend API (easily replaceable)
- HTML and plain text email formats
- Reply-to set to user's email
- Configurable via environment variables

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure the following variables:

```env
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL_TO=hello@crisp.com
CONTACT_EMAIL_FROM=noreply@crisp.com
```

### 2. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Create an API key
4. Add it to `.env.local`

### 3. Video Setup

The video file should be located at:
```
/public/img/crisp-chucha.webm
```

Optional: Add a poster image for fallback:
```
/public/img/crisp-chucha-poster.jpg
```

## Usage

### Access the Form

Navigate to `/contact` to view the contact form.

### Development Mode

In development, emails are logged to the console instead of being sent:

```bash
npm run dev
```

Check the terminal for email content when submitting the form.

### Production Mode

In production, emails are sent via Resend API. Ensure all environment variables are configured.

## File Structure

```
src/
├── app/
│   ├── contact/
│   │   └── page.tsx              # Contact page with split layout
│   ├── privacy-policy/
│   │   └── page.tsx              # GDPR privacy policy
│   └── api/
│       └── contact/
│           └── route.ts          # API endpoint with validation & rate limiting
├── components/
│   └── forms/
│       └── ContactForm.tsx       # Progressive form component
└── lib/
    └── email.ts                  # Email sending utility (Resend)
```

## Customization

### Change Email Provider

Edit `src/lib/email.ts` and replace the Resend implementation with your preferred email service (SendGrid, Mailgun, etc.).

### Modify Form Fields

Edit `src/components/forms/ContactForm.tsx`:
- Update `serviceOptions` for different service types
- Update `meetingTimeOptions` for different time slots
- Add/remove fields as needed

### Styling

The form uses the existing design system:
- Input and Dropdown components from `src/components/ui/`
- CSS variables from `globals.css`
- Tailwind utility classes

## Security Features

1. **Honeypot**: Hidden field catches automated bots
2. **Rate Limiting**: Prevents spam (5 requests/hour/IP)
3. **Server Validation**: All data validated on server
4. **XSS Protection**: HTML escaping in email templates
5. **GDPR Compliance**: Explicit consent required

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ Error messaging
- ✅ Screen reader friendly

## Testing

### Test the Form

1. Navigate to `/contact`
2. Fill in Step 1 fields
3. Click "Continue"
4. Fill in Step 2 fields
5. Check GDPR consent
6. Submit

### Check Email (Development)

Look for console output:
```
📧 Contact Form Submission: { name: '...', email: '...', ... }
```

### Test Rate Limiting

Submit the form 6 times within an hour to trigger rate limiting.

### Test Validation

Try submitting with:
- Empty fields
- Invalid email format
- Without GDPR consent

## Troubleshooting

### Emails Not Sending

1. Check `RESEND_API_KEY` is set correctly
2. Verify domain in Resend dashboard
3. Check `CONTACT_EMAIL_FROM` uses verified domain
4. Look for errors in server logs

### Rate Limiting Issues

Rate limit store is in-memory and resets on server restart. For production, consider using Redis or a database.

### Video Not Playing

1. Ensure video file exists at `/public/img/crisp-chucha.webm`
2. Check browser console for errors
3. Verify video codec compatibility (WebM with VP9)
4. Add poster image as fallback

## Future Enhancements

- [ ] Database persistence (optional)
- [ ] Email confirmation to user
- [ ] File upload support
- [ ] Multi-language support
- [ ] Analytics tracking
- [ ] A/B testing variants
