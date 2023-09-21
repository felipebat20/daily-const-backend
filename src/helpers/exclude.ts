export function exclude<User, Key extends keyof User>(
  model: Object,
  keys: Array<string>
): Omit<Object, any> {
  return Object.fromEntries(
    Object.entries(model).filter(([key]) => !keys.includes(key))
  );
}

