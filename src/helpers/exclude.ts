export function exclude<User, Key extends keyof User>(
  model: Object,
  keys: Array<String>
): Omit<Object, any> {
  return Object.fromEntries(
    Object.entries(model).filter(([key]) => !keys.includes(key))
  )
}

