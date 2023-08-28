const cacheKey = Symbol("cache");
const argumentCacheKey = Symbol("argumentCache");

export function memoize(
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>
): TypedPropertyDescriptor<any> | void {
  if (!descriptor || typeof descriptor.value !== "function") {
    throw new TypeError(
      `Only methods can be decorated with @memoize. <${String(
        propertyKey
      )}> is not a method!`
    );
  }

  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const instance = this as typeof target & CacheContainer;

    if (!instance[cacheKey]) {
      instance[cacheKey] = new Map();
    }

    const argKey = JSON.stringify(args);
    if (!instance[argumentCacheKey]) {
      instance[argumentCacheKey] = new Map();
    }
    if (instance[argumentCacheKey].has(argKey)) {
      return instance[cacheKey].get(instance[argumentCacheKey].get(argKey)!);
    }

    const result = originalMethod.apply(this, args);
    const resultKey = Symbol();
    instance[cacheKey].set(resultKey, result);
    instance[argumentCacheKey].set(argKey, resultKey);
    return result;
  };

  return descriptor;
}

type CacheContainer = {
  [key in typeof cacheKey]: Map<symbol, any>;
};
