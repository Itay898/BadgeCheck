// eslint-config-next v16+ exports native flat configs.
// Using FlatCompat.extends() on them serializes plugin instances and triggers
// a "circular structure" error, so we import them directly.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Lint scope:
    //   - All owned TavCheck product/site code IS linted (src/app/(site)/**,
    //     src/components/site/**, src/components/editorial/**,
    //     src/components/tool/**, src/content/**, src/services/**, src/lib/**,
    //     plus the root layout, sitemap, robots, opengraph-image, etc.).
    //   - The paths below are vendored Tambo chat-template files that ship
    //     with the Tambo starter. We do NOT lint them, because fixing their
    //     stylistic issues would mean editing /chat behavior — and the chat
    //     experience must stay identical to the upstream template.
    //   - The first five entries are universal build/output artifacts, not
    //     owned code, so they're ignored as a matter of course.
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/components/tambo/**", // vendored: Tambo UI components used by /chat
      "src/app/interactables/**", // vendored: Tambo "interactables" demo route
      "src/app/chat/**", // vendored: the Tambo chat page itself
    ],
  },
];

export default config;
