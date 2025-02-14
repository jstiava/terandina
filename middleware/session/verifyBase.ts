import { fail } from '@/lib/utils/chalk';
import { Base } from '@/types/globals';

export default function verifyBase(
  token: string | string[] | undefined | null,
): Base | null {

  if (!token) return null;

  try {
    if (!token) {
      return null;
    }
    const base = new Base(String(token));
    if (!base) {
      fail("Invalid base token: Case 2")
      return null;
    }
    return base;
  }
  catch (err) {
    fail("Invalid base token");
    console.log(err);
    return null;
  }
}
