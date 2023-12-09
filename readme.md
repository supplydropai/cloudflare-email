# Cloudflare Email
A way to send 100,000 free emails per day using Cloudflare Workers and MailChannels.

### How it Works
Any email request sent to MailChannels from a Cloudflare Worker is [completely free](https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/). Cloudflare allows for 100,000 free worker requests to be made per day, with additional requests priced at $0.30/million.

### Setup
```bash
# clone the repository
git clone https://github.com/supplydropai/cloudflare-email

# install the dependencies
npm install

# create TOKEN environment variable
npx wrangler secret put --env production TOKEN

# deploy the worker
npm run deploy
```

Or deploy directly to Cloudflare

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/supplydropai/cloudflare-email)

## Domain Setup
You will need to add some DNS records to your domain in order to send emails. These are required to make sure no one else can send emails from your domain.

### Add SPF Record
Add a `TXT` record with the following data
```
Name: @
Value: v=spf1 a mx include:relay.mailchannels.net ~all
```

### Add MailChannels Verification Record
Add a `TXT` record with the following data

```
Name: _mailchannels
Value: v=mc1 cfid=yourdomain.workers.dev
```

## Usage
After deploying the worker, you can then send emails by making a `POST` request to the worker.

### Sending an Email
Make a `POST` request to the following URL, header, and JSON Data. Replace `YOUR_PROJECT` with the name of your worker and `YOUR_DOMAIN` with the name of your worker domain.

Domain
```
https://YOUR_PROJECT.YOUR_DOMAIN.workers.dev/api/email/send
```
Headers
```json
{
    "Authorization": "TOKEN_YOU_SET_EARLIER"
}
```
JSON body
```json
{
    "to": "someuser@example.com",
    "from": "no-reply@mycompany.com",
    "subject": "Your Verification Code",
    "text": "Your verification code is 699256"
}
```

## Options
This worker allows you to modify many parts of the email. Below are some examples.
### HTML Email
Instead of providing text content you can pass in an `html` parameter that will take in a string containing the HTML you want to render. If you include both the `text` and `html` parameters in the request, it will be sent as a multipart request.
```json
{
    "to": "someuser@example.com",
    "from": "no-reply@mycompany.com",
    "subject": "Your Verification Code",
    "html": "<html><span>Your verification code is 699256</span></html>"
}
```
### Adding replyTo, CC, BCC
You can also specify any of Reply-To, CC, or BCC parameters in your emails.
```json
{
    "to": "someuser@example.com",
    "from": "no-reply@mycompany.com",
    "replyTo": "support@mycompany.com",
    "cc": "customer-service@mycompany.com",
    "bcc": "logs@mycompany.com",
    "subject": "Your Verification Code",
    "text": "Your verification code is 699256"
}
```
### Adding names to any of To, From, replyTo, CC, or BCC
You can also specify names for any of the parameters that contains an email.
```json
{
    "to": {"email": "someuser@example.com", "name": "Some User"},
    "from": {"email": "no-reply@mycompany.com", "name": "MyCompany No-Reply"},
    "replyTo": {"email": "support@mycompany.com", "name": "MyCompany Support"},
    "cc": {"email": "customer-service@mycompany.com", "name": "Customer Service"},
    "bcc": {"email": "logs@mycompany.com", "name": "Logging Service"},
    "subject": "Your Verification Code",
    "text": "Your verification code is 699256"
}
```
