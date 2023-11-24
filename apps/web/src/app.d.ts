// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import PocketBase from 'pocketbase';

declare global {
    declare namespace App {
        interface Locals {
            pb: PocketBase
        }
    }
}

export {};