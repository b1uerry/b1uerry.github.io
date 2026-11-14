# 写博客指南

> 站点：<https://b1uerry.github.io/>
> 技术栈：Hexo 8 + NexT 8（Gemini 主题），GitHub Actions 自动构建部署

---

## 0. 一次性准备

### 安装 Node.js

本项目需要 **Node.js ≥ 20.19**。

当前机器已把 Node 解压在 `D:\Tools\node` 并加入用户 PATH，新开终端即可使用：

```bash
node -v      # v24.x
npm -v
```

### 安装依赖

```bash
cd D:\Astudy\blog\b1uerry.github.io
npm install
```

> 项目里已带 `.npmrc`，默认走 `registry.npmmirror.com` 国内镜像。
> 依赖装好后会生成 `node_modules/`（已被 `.gitignore` 忽略，不要提交）。

---

## 1. 本地预览

```bash
npm run server      # 等价于 npx hexo server
```

- 浏览器打开 <http://localhost:4000>
- 修改 `source/` 下的文件会**自动重新生成**，刷新页面即可
- 停止：在终端按 `Ctrl + C`

---

## 2. 写一篇新文章

```bash
npx hexo new "文章标题"
```

- 生成文件：`source/_posts/文章标题.md`
- 打开后顶部是 front-matter，例如：

```markdown
---
title: 文章标题
date: 2026-11-14 19:30:00
tags:
  - 标签A
  - 标签B
categories:
  - 分类名
---
```

字段说明：

| 字段 | 说明 |
|---|---|
| `title` | 标题，留空则用文件名 |
| `date` | 发布时间，决定文章 URL（`/年/月/日/文件名/`） |
| `updated` | 更新时间，不写则默认用文件修改时间 |
| `tags` | 标签，可多个 |
| `categories` | 分类，可多个（会形成层级） |
| `comments` | 设为 `false` 可关闭该篇评论 |

> ⚠️ **日期不要带时区/时间偏移**，直接写 `2026-11-14 19:30:00` 即可。
> 本项目已移除 `timezone` 配置，保证本地和 GitHub Actions（UTC）生成的文章 URL 完全一致。

正文用 Markdown 编写，常用语法：

````markdown
## 二级标题

普通段落，支持**加粗**、*斜体*、`行内代码`、[链接](https://example.com)。

```python
print("hello")
```

行内公式：$E = mc^2$

块级公式：

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

图片：![图片说明](/images/xxx.png)
````

前 3 行左右会自动作为摘要显示在首页；想自定义摘要位置，在正文里插入：

```markdown
<!-- more -->
```

---

## 3. 图片怎么放

**推荐**：图片直接放进站点仓库，随站点一起发布：

1. 把图片复制到 `source/images/`（可以建子目录，如 `source/images/pics/`）
2. 文章里用绝对路径引用：

```markdown
![示意图](/images/pics/xxx.png)
```

这样不依赖任何第三方图床，国内访问也稳定。

> 旧的 `photo-house` 图床方案已废弃（jsDelivr → raw.githubusercontent.com 在国内基本不可用）。

---

## 4. 新建独立页面

```bash
npx hexo new page "links"
```

会生成 `source/links/index.md`，在 `_config.next.yml` 的 `menu` 里加一行即可出现在导航栏：

```yaml
menu:
  links: /links/ || fa fa-link
```

---

## 5. 发布

```bash
git add -A
git commit -m "post: 文章标题"
git push
```

推送后 GitHub Actions 自动执行：

1. `npm ci` 安装依赖
2. `npx hexo generate` 生成静态站点
3. 发布到 GitHub Pages

大约 1–2 分钟后线上生效。查看进度：
<https://github.com/b1uerry/b1uerry.github.io/actions>

### 也可以网页端写

在 GitHub 仓库里直接新建/编辑 `source/_posts/*.md`，提交到 `main` 后同样会自动发布。

---

## 6. 常用命令速查

| 命令 | 作用 |
|---|---|
| `npm run server` | 本地预览（4000 端口） |
| `npm run build` | 只生成静态文件到 `public/` |
| `npm run clean` | 清除缓存和 `public/` |
| `npx hexo new "标题"` | 新建文章 |
| `npx hexo new page "名称"` | 新建页面 |
| `npx hexo list post` | 列出所有文章 |

---

## 7. 配置文件在哪

| 文件 | 作用 |
|---|---|
| `_config.yml` | Hexo 主配置：站点标题、URL、永久链接、插件 |
| `_config.next.yml` | NexT 主题配置：菜单、侧边栏、代码块、搜索、深色模式、评论、统计 |
| `scaffolds/` | `hexo new` 时使用的模板 |
| `source/_posts/` | 文章 |
| `source/images/` | 图片 |
| `.github/workflows/deploy.yml` | 自动部署流程 |

> 主题本身在 `node_modules/hexo-theme-next/` 里，**不要修改**，所有自定义都写在 `_config.next.yml`。

---

## 8. 常见问题

**Q：本地能打开，线上 404？**
A：看 Actions 是否成功；再看文章日期是否和 URL 一致（URL 由 `date` 决定）。

**Q：图片不显示？**
A：确认路径以 `/images/` 开头（不是 `./images/`），且文件已提交到 `source/images/`。

**Q：想改站点标题/副标题？**
A：改 `_config.yml` 里的 `title` / `subtitle` / `description`。

**Q：怎么加评论 / 统计？**
A：见 `_config.next.yml` 里 `giscus` 与 `google_analytics` / `umami` 段落的注释说明。

**Q：想换主题配色 / 布局？**
A：`_config.next.yml` 顶部 `scheme` 可选 `Muse` / `Mist` / `Pisces` / `Gemini`。

---

## 9. 评论 / 深色模式 / 访问统计

### 评论（Giscus）

- 文章底部自动出现评论区，评论存在本仓库的 **Discussions** 里（分类 `Announcements`）
- 配置在 `_config.next.yml` 的 `giscus:` 段
- 某篇文章不想开评论：在 front-matter 里加 `comments: false`
- 前置依赖（已完成）：仓库开启 Discussions + 安装 <https://github.com/apps/giscus>
- 想换评论分类：到 <https://giscus.app> 重新生成配置，替换 `category` / `category_id`

### 深色模式

- 左下角 🌙/☀️ 按钮手动切换，选择记录在浏览器 `localStorage`
- 首次访问时跟随操作系统设置
- 实现方式：
  - `scripts/darkmode.js`：构建时把 `@media (prefers-color-scheme: dark)` 转成 `html[data-theme="dark"]`
  - `source/_data/head.njk`：渲染前设置 `data-theme`，避免闪白
  - `source/_data/body-end.njk`：切换按钮
  - `source/_data/styles.styl`：按钮样式

### 访问统计

在 `_config.next.yml` 里二选一填好即可（当前留空 = 不启用）：

```yaml
# GA4
google_analytics:
  tracking_id: G-XXXXXXXXXX

# 或 Umami
umami:
  enable: true
  script_url: https://umami.example.com/script.js
  website_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 10. 备份与恢复

- **源码**：GitHub 仓库 `b1uerry/b1uerry.github.io`（`main` 分支）
- 之前的静态站产物备份在本地 `d:\Astudy\blog\_old-site-backup`（确认无误后可删）
