const get = (obj, path, defaultValue) => {
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
