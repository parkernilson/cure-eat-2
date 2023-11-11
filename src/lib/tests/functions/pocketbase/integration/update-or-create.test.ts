import { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD, PB_DEV_PORT, PB_DEV_URL } from '$env/static/private';
import { establishConnection } from '$lib/functions/utils/pocketbase';
import { execSync } from 'node:child_process';
import PocketBase from 'pocketbase';
import { afterEach, beforeEach, describe } from 'vitest';

describe('update-or-create integration', async () => {
	let adminClient: PocketBase;

	beforeEach(async () => {
		execSync('npm run start:pb-test');

		adminClient = new PocketBase(`${PB_DEV_URL}:${PB_DEV_PORT}`);

		await establishConnection(adminClient);
		await adminClient.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
	});

	afterEach(async () => {
		execSync('npm run stop:pb-test');
	});
});
