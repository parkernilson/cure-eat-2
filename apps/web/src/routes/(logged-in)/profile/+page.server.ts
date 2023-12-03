import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (
    async ({ locals }) => {
        if (!locals.pb.authStore.model) {
            throw redirect(302, '/login')
        } else {
            return {
                user: locals.pb.authStore.model
            }
        }
    }
) satisfies PageServerLoad;

export const actions = {
    logout: async ({ locals }) => locals.pb.authStore.clear()
}