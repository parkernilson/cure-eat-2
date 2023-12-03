import { redirect } from '@sveltejs/kit';

export const load = (({ locals }) => {
    if (locals.pb.authStore.model) {
        throw redirect(302, '/lists')
    }
}) 