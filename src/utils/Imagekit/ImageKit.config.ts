import "server-only";
import ImageKit from "imagekit";

/**
 * @brief Configures and initializes the ImageKit client for accessing image assets.
 */
export default function imageKitConfig(): ImageKit {
  return new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  });
}