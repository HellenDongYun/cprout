export default function getBaseURL() {
  // 在浏览器环境下，返回相对路径（用于前端请求）
  if (typeof window !== "undefined") return "";

  // 在 Vercel 环境中，动态构建完整的生产 URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // 如果配置了自定义域名，通过环境变量返回域名
  if (process.env.DOMAIN_URL) return `https://${process.env.DOMAIN_URL}`;

  // 本地开发环境，使用 localhost
  return "http://localhost:3000";
}
