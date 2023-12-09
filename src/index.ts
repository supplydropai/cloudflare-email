import { Router } from 'itty-router';
import { handleEmail } from './email';

const router = Router();

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const token = env.TOKEN;
		console.log(url.pathname);

		router.post('/api/email/send', async (request) => {
			const content = await request.json();
			const auth = request.headers.get('Authorization');

			if (!auth) {
				return new Response(JSON.stringify({ ok: false, error: 'Authorization header is missing.', timestamp: new Date().toISOString() }), {
					status: 401,
					headers: { 'Content-Type': 'application/json' },
				});
			}

			if (!token) {
				return new Response(JSON.stringify({ ok: false, error: 'TOKEN environment variable is not set.', timestamp: new Date().toISOString() }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				});
			}

			if (auth !== token) {
				return new Response(JSON.stringify({ ok: false, error: 'Unauthorized', timestamp: new Date().toISOString() }), {
					status: 401,
					headers: { 'Content-Type': 'application/json' },
				});
			}

			const emailResponse = await handleEmail(content);

			const failedJson = JSON.stringify({ ok: false, error: 'Internal Server Error', timestamp: new Date().toISOString() });

			return new Response(JSON.stringify(emailResponse) || failedJson, {
				status: emailResponse.status || 500,
				headers: { 'Content-Type': 'application/json' },
			});
		});

		router.all('*', () => new Response('Not Found.', { status: 404 }));

		return router.handle(request);
	},
};