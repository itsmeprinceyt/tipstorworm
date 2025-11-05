import axios from "axios";

/**
 * @brief Retrieves a single boolean setting value from the server
 *
 * @description
 * This function makes a POST request to the server to fetch the value of a specific setting.
 * It's designed to work with a settings API endpoint that returns boolean values.
 *
 * @note
 * - The function uses a POST request with the key in the request body
 * - The expected API response format is: { [key]: boolean }
 * - Errors are caught and logged, but the function always returns false on error
 * - This is a client-side function meant for browser environments
 */
export async function getSetting(key: string): Promise<boolean> {
  try {
    const response = await axios.post<Record<string, boolean>>(
      "/api/public/single-setting",
      { key }
    );
    return response.data[key] ?? false;
  } catch (error) {
    console.error("Error fetching setting:", error);
    return false;
  }
}
