import bcrypt from "bcryptjs";

export async function hashPass(password) {
  return await bcrypt.hash(password, 10);
}
