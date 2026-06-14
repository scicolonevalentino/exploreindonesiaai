// mammoth ships a self-contained browser bundle that doesn't rely on Node's
// Buffer/fs. We import that entry directly to stay safe in the Vite client
// bundle; it has no bundled types, so declare the slice we use.
declare module "mammoth/mammoth.browser" {
  export function convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<{
    value: string;
    messages: { type: string; message: string }[];
  }>;
  const _default: { convertToHtml: typeof convertToHtml };
  export default _default;
}
