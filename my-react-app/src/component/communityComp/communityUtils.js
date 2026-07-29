export const COMMUNITY_TAGS = [
  "General",
  "CSE",
  "ECE",
  "AI",
  "Placements",
  "Doubt",
  "Labs",
  "Hostel",
];

export const POST_TYPES = [
  { value: "question", label: "Question" },
  { value: "discussion", label: "Discussion" },
  { value: "resource", label: "Resource tip" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "top", label: "Most upvoted" },
  { value: "active", label: "Most discussed" },
  { value: "views", label: "Most viewed" },
  { value: "oldest", label: "Oldest" },
];

export function timeAgo(date) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN");
}

export function requireAuth(isAuthenticated) {
  if (!isAuthenticated) {
    window.location.href = "/login";
    return false;
  }
  return true;
}
