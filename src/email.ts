const handleEmail = async (json: any) => {
	try {
		// validate the request body
		if (!json.to) {
			throw new Error('Missing "to" field in the request body');
		}

		if (!json.from) {
			throw new Error('Missing "from" field in the request body');
		}
	
		if (!json.subject) {
			throw new Error('Missing "subject" field in the request body');
		}
	
		if (!json.text && !json.html) {
			throw new Error('Either "text" or "html" field must be present in the request body');
		}
	
		// Destructure the necessary parameters from the JSON
		const { to, from, subject, text, html, cc, bcc, replyTo } = json;
	
		// Helper function to format email addresses
		const formatEmails = (emails: string[]) => {
			return Array.isArray(emails) ? emails.map(email => {
				return typeof email === 'string' ? { email } : email;
			}) : [{ email: emails }];
		};
	
		// Format each of the email fields
		const toFormatted = formatEmails(to);
		const ccFormatted = cc ? formatEmails(cc) : [];
		const bccFormatted = bcc ? formatEmails(bcc) : [];
	
		// Create the content array
		const content = [];
		if (text) content.push({ type: 'text/plain', value: text });
		if (html) content.push({ type: 'text/html', value: html });
	
		// Construct the request to MailChannels
		const mailChannelsRequest = new Request('https://api.mailchannels.net/tx/v1/send', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				personalizations: [{
					to: toFormatted,
					cc: ccFormatted,
					bcc: bccFormatted
				}],
				from: typeof from === 'string' ? { email: from } : from,
				subject: subject,
				content: content,
				reply_to: replyTo ? (typeof replyTo === 'string' ? { email: replyTo } : replyTo) : undefined,
			}),
		});
	
		// Send the email
		const response = await fetch(mailChannelsRequest);
	
		// Handle the MailChannels response
    if (response.ok) {
      return { ok: true, timestamp: new Date().toISOString(), status: 200 };
    } else {
			const errorBody = await response.text();
			return { ok: false, error: "MAILCHANNELS: " + errorBody, timestamp: new Date().toISOString(), status: response.status };
    }
	} catch (error: any) {
		return { ok: false, error: error.message, timestamp: new Date().toISOString(), status: 500 };
	}
};

export { handleEmail };