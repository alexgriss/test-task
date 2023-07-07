const get = (obj: Object, path: string, defaultValue?: any) => {
  if (Object.keys(obj).length === 0) {
    return defaultValue;
  }

  const keysFromPath = path.split(".");

  const firstKey = keysFromPath[0];

  if (!Object.keys(obj).includes(firstKey)) {
    return defaultValue;
  }

  const nextKeysFromPath = keysFromPath.slice(1);

  if (nextKeysFromPath.length) {
    return get(obj[firstKey], nextKeysFromPath.join("."), defaultValue);
  }

  return obj[firstKey];
};
