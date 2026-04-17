const usageMap = new Map();

const FREE_LIMIT = 10;

export function checkRateLimit(ip) {
  const usage = usageMap.get(ip) || 0;

  if (usage >= FREE_LIMIT) {
    return { allowed: false, usage, limit: FREE_LIMIT };
  }

  usageMap.set(ip, usage + 1);
  return { allowed: true, usage: usage + 1, limit: FREE_LIMIT };
}

export function getUsage(ip) {
  return usageMap.get(ip) || 0;
}
