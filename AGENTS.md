# AGENTS.md

项目：个人作品集网站（React + Vite + Tailwind 前端，**纯静态**，托管于 GitHub Pages）。
已移除全部「后台简历管理」能力（后端 server/、管理台 /admin/resume、登录鉴权、邀请码/访客追踪、在线双语翻译），
站点全站公开，简历内容通过「改 yaml → 构建 → push」更新。

---

## 全站访问规则（落地即简历页，无任何登录/鉴权）

| 路由 | 内容 | 可达性 |
| --- | --- | --- |
| `/work` | 简历页（公开给 HR 看的完整简历） | ✅ **唯一落地页**。打开站点（含空 hash / `#/` / 任意未知 hash）都会自动落到这里 |
| `/`（首页） | 欢迎页代码（视频 + 生活/工作入口） | ⛔ 代码完整保留，但路由不可达（被落地重定向封住） |
| `/life` | 个人生活页 | ⛔ 代码完整保留，但不可达 |

- 角色/鉴权已移除，无 admin / 访客 / 邀请码。
- **落地策略在 `src/App.tsx` 的 `parseHashRoute`**：除 `/work` 外一律送回 `/work`。
  未来想重新开放首页或生活页，只须在 `parseHashRoute` 里让对应 hash 返回其 route（代码都在，组件与路由分支均未删）。

---

## 简历内容数据流（极简 · 唯一更新方式）

```
data/resume.yaml          ← 唯一内容源（改简历就改这里）
   │  npm run build
   ▼
scripts/build-resume.mjs  →  public/resume.json（打进 bundle，/work 据此渲染）
   │
   ▼
src/work/* 各 Section 渲染
```

- **`data/resume.yaml` 是唯一的「改简历入口」**。改完跑 `npm run build` 再提交推送。
- `public/resume.pdf` 是**手工维护的静态简历 PDF**（N 简历页右上角「下载简历」指向它）。
  后端已删，不再自动生成 PDF——**更新 PDF 时请手动把新 PDF 替换到 `public/resume.pdf`**。

---

## 构建与部署

```bash
npm run dev        # 本地开发（先 build:resume 生成 resume.json，再起 vite）
npm run build      # 生成 resume.json + tsc 校验 + 产出 dist/
npm run preview    # 本地预览构建产物
```

- 部署靠 GitHub Actions（`.github/workflows/deploy.yml`）：push 到 `main` 自动 `npm run build` 并部署到 GitHub Pages。
- `vite.config.ts` 的 `base`：本地为 `/`；CI 设 `GH_PAGES=true` 时为 `/my_web/`（对应仓库名路径）。

---

## 目录说明

| 路径 | 作用 | 是否提交 |
| --- | --- | --- |
| `data/resume.yaml` | 简历内容源（唯一内容源） | ✅ 提交 |
| `data/` 其它（resumes/、resume-v*.yaml、resume-meta.json、tokens.json、sessions.json、access-log.jsonl、tmp/） | 已删后端遗留的运行时文件 | ❌ gitignore |
| `public/resume.json` | 构建产物（由 resume.yaml 生成） | ✅ 提交 |
| `public/resume.pdf` | 手工维护的静态简历 PDF | ✅ 提交 |
| `src/work/*` | 简历页各板块组件 | ✅ |
| `scripts/build-resume.mjs` | yaml → resume.json 的构建脚本 | ✅ |

---

## 环境变量

**不再需要任何后端环境变量**（已删 ADMIN_PASSWORD / DEEPSEEK_API_KEY / GITHUB_TOKEN 等）。
仅 CI 在构建时设 `GH_PAGES=true` 控制资源路径前缀。
