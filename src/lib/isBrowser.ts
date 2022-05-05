/**
 * check whether the current environment is a browser or nodejs
 *
 * @export
 * @return {boolean}
 */
export function isBrowser(): boolean {
  return typeof window === 'object';
}
