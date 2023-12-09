import type { ActionReturn } from "svelte/action";

interface Attributes {
    'on:clickoutside': (event: CustomEvent<HTMLElement>) => void
}

/**
 * A svelte component action that emits a clickoutside event when the user clicks outside of the element.
 * Use it like this:
 * ```
 * <div use:clickOutside on:clickoutside={doSomething}>
 * ```
 * @param node 
 * @returns 
 */
export const clickOutside = (node: HTMLElement): ActionReturn<undefined, Attributes> => {
    const handleClick = (event: MouseEvent) => {
        if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent('clickoutside', { detail: node }));
        }
    }

    document.addEventListener('click', handleClick, true)

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true)
        }
    }
}