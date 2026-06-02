import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient: SanityClient = createClient({
  projectId: "u4ah1ore",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
