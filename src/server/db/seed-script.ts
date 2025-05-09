// Load environment variables first
import "./load-env";

import { seed } from "./seed";

// Run the seed function
seed()
  .then(() => {
    console.log("Database seeded successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
