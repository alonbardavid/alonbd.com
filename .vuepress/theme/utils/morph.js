const DEFAULT_DURATION = 500;
const DEFAULT_EASING = 'cubic-bezier(0.4,0,0.2,1)';

const running = new WeakMap();

/**
 * Animates `element` from where it is now to wherever `mutate` leaves it.
 * The layout switch happens in a single frame, the travel is played back as a
 * uniform translate + scale, so nothing is re-laid out while it moves.
 *
 * `element` must keep its aspect ratio across the mutation (the scale is
 * uniform, so a changing ratio would squash it) and be styled with
 * `transform-origin: 0 0`.
 */
export function morph(element, mutate, {duration = DEFAULT_DURATION, easing = DEFAULT_EASING} = {}) {
    const previous = running.get(element);
    if (previous) {
        previous.cancel();
    }
    const first = element.getBoundingClientRect();
    mutate();
    const last = element.getBoundingClientRect();

    if (!element.animate || !first.width || !last.width) {
        return Promise.resolve();
    }
    const scale = first.width / last.width;
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(scale - 1) < 0.01) {
        return Promise.resolve();
    }
    const animation = element.animate([
        {transform: `translate(${dx}px,${dy}px) scale(${scale})`},
        {transform: 'none'}
    ], {duration, easing});
    running.set(element, animation);

    return new Promise(resolve => {
        const done = () => {
            if (running.get(element) === animation) {
                running.delete(element);
            }
            resolve();
        };
        animation.onfinish = done;
        animation.oncancel = done;
    });
}
