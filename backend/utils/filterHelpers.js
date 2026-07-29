/** Escape user input for safe use inside RegExp / Mongo $regex. */
const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Case-insensitive exact field match: "CSE" matches "cse", "Cse". */
const ciExact = (value) => ({
  $regex: `^${escapeRegex(String(value).trim())}$`,
  $options: "i",
});

/**
 * Branch codes in DB may be stored as CSE / cse / full names.
 * Filter value from UI is usually CSE | ECE | AI.
 */
const BRANCH_ALIASES = {
  cse: [
    "cse",
    "computer science",
    "computer science engineering",
    "computer science and engineering",
  ],
  ece: [
    "ece",
    "electronics",
    "electronics and communication",
    "electronics and communication engineering",
  ],
  ai: ["ai", "artificial intelligence", "aiml", "ai/ml"],
};

const normalizeBranchCode = (branch = "") => {
  const raw = String(branch).trim();
  if (!raw) return "";
  const lower = raw.toLowerCase();

  for (const [code, aliases] of Object.entries(BRANCH_ALIASES)) {
    if (aliases.some((a) => lower === a || lower.includes(a))) {
      return code.toUpperCase();
    }
  }

  // Already a short code like "CSE"
  if (/^[a-z]{2,6}$/i.test(raw)) return raw.toUpperCase();
  return raw;
};

/** Mongo condition for branch field (papers metadata.branch or notes.branch). */
const branchMatchCondition = (fieldPath, branch) => {
  const code = normalizeBranchCode(branch);
  if (!code) return null;

  const aliases = BRANCH_ALIASES[code.toLowerCase()] || [code.toLowerCase()];
  const patterns = [...new Set([code.toLowerCase(), ...aliases])];

  return {
    $or: patterns.map((term) => ({
      [fieldPath]: {
        $regex: `^${escapeRegex(term)}$`,
        $options: "i",
      },
    })),
  };
};

/** Merge extra conditions without clobbering an existing top-level $or. */
const andConditions = (filter, ...conditions) => {
  const extras = conditions.filter(Boolean);
  if (!extras.length) return filter;

  if (!filter.$and && !filter.$or && extras.length === 1) {
    return { ...filter, ...extras[0] };
  }

  const base = { ...filter };
  const existingAnd = base.$and || [];
  delete base.$and;

  // If base still has fields, keep them; push $or/$and extras into $and
  const parts = [];
  const { $or: baseOr, ...rest } = base;
  if (Object.keys(rest).length) parts.push(rest);
  if (baseOr) parts.push({ $or: baseOr });
  parts.push(...extras);

  return { $and: [...existingAnd, ...parts] };
};

const containsCi = (value) => ({
  $regex: escapeRegex(String(value).trim()),
  $options: "i",
});

module.exports = {
  escapeRegex,
  ciExact,
  normalizeBranchCode,
  branchMatchCondition,
  andConditions,
  containsCi,
};
