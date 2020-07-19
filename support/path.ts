/**
 * Check file is exist
 * @param  {string} filename
 * @returns Promise
 */
export async function exists(filename: string) : Promise<boolean> {
    try {
        await Deno.stat(filename);
        return true;
    } catch (error) {
        return false;
    }
};