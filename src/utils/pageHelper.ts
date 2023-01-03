export const pageHelper = <T = any>(
  data: [T[], number],
  page = 1,
  offset = 10,
) => {
  const list = data[0] || [];
  const listIsEmpty = list.length === 0;
  const count = data[1] || 0;
  const prev = !listIsEmpty ? page - 1 || null : null;
  const next = !listIsEmpty ? Math.floor(count / offset) + 1 : null;

  return {
    list,
    current: page,
    prev: prev,
    next: next,
    hasPrev: prev !== null && !listIsEmpty,
    hasNext: next !== page && !listIsEmpty,
    total: count,
  };
};
