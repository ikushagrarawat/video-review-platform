import { connectDatabase } from "../config/db.js";
import User from "../models/User.js";

const users = [
  {
    name: "Admin User",
    email: "admin@acme.test",
    password: "password123",
    organizationId: "acme",
    role: "admin"
  },
  {
    name: "Editor User",
    email: "editor@acme.test",
    password: "password123",
    organizationId: "acme",
    role: "editor"
  },
  {
    name: "Viewer User",
    email: "viewer@acme.test",
    password: "password123",
    organizationId: "acme",
    role: "viewer"
  },
  {
    name: "Editor User Beta",
    email: "editor@beta.test",
    password: "password123",
    organizationId: "beta",
    role: "editor"
  }
];

const seed = async () => {
  await connectDatabase();
  await User.deleteMany({ email: { $in: users.map((user) => user.email) } });
  for (const user of users) {
    await User.create(user);
  }
  console.log("Demo users seeded");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
