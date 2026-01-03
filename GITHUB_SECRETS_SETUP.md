# GitHub Actions Setup

## Required GitHub Secrets

To build the APK via GitHub Actions, you need to configure the following secrets in your repository:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:

### Required Secrets:

- `RESEND_API_KEY`: Your Resend API key for sending emails
- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number (e.g., +13252412445)
- `ADMIN_EMAIL`: Admin email address for notifications
- `ADMIN_PHONE_NUMBER`: Admin phone number for SMS notifications (e.g., +919810554738)

**Note**: The actual secret values are already configured in the repository settings.

## How the Build Works

The GitHub Actions workflow (`.github/workflows/build-android.yml`) will:
1. Check out the code
2. Set up Node.js and Android build tools
3. Install dependencies
4. **Create `src/config/api.config.ts` from the secrets**
5. Build the APK
6. Upload the APK as an artifact

The `api.config.ts` file is gitignored for security, but gets created during CI/CD builds using the secrets.
