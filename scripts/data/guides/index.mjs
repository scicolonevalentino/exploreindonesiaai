// Aggregates all supporting-guide content modules for scripts/seed-guides.mjs.
// Add new cluster files here as they are authored.

import { baliGuides } from "./bali.mjs";
import { lombokGiliGuides } from "./lombok-gili.mjs";
import { komodoFloresGuides } from "./komodo-flores.mjs";
import { nusaPenidaGuides } from "./nusa-penida.mjs";
import { rajaAmpatGuides } from "./raja-ampat.mjs";
import { javaGuides } from "./java.mjs";
import { sumatraGuides } from "./sumatra.mjs";

export const GUIDES = [
  ...baliGuides,
  ...lombokGiliGuides,
  ...komodoFloresGuides,
  ...nusaPenidaGuides,
  ...rajaAmpatGuides,
  ...javaGuides,
  ...sumatraGuides,
];
