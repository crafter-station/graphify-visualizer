/**
 * Open a local graph.html with the OS default app (browser).
 * Desktop / Electron only — matches isDesktopOnly.
 * @returns null on success, error message string on failure
 */
export async function openGraphHtml(htmlPath: string): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const electron = require("electron") as {
      shell: { openPath: (p: string) => Promise<string> };
    };
    const err = await electron.shell.openPath(htmlPath);
    return err && err.length > 0 ? err : null;
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}
