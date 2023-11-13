import type { AccessToken, AccessTokenRecordModel } from '$lib/interfaces/tokens/tokens';

export const client_token: AccessToken = {
    company: 'kroger',
	access_token: 'fake JWT token',
    scope: 'product.compact',
    expires: '2200-10-29T04:08:43.628Z',
};

export const client_token_record: AccessTokenRecordModel = {
    ...client_token,
    id: 'a6cd165a-84a7-40b2-8bc5-1f3cea8105eb',
    collectionId: 'f573cc9d-6430-48ec-b6d6-bddede935162',
    collectionName: 'admin_tokens',
    created: '2021-10-29T04:08:43.628Z',
    updated: '2021-10-29T04:08:43.628Z',
};
