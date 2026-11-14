# b1uerry.github.io

个人博客的 **Hexo 源码仓库**（不是构建产物）。推送到 `main` 后由 GitHub Actions 自动构建并发布到 GitHub Pages。

- 线上地址：<https://b1uerry.github.io/>
- 生成器：Hexo 8
- 主题：NexT 8（Gemini scheme）

## 本地开发

需要 Node.js ≥ 20.19。

```bash
npm install
npx hexo server        # http://localhost:4000
```

## 写文章

```bash
npx hexo new "文章标题"
```

新文件位于 `source/_posts/`，用 Markdown 编写。图片放在 `source/images/`，引用方式：

```markdown
![说明](/images/xxx.png)
```

## 目录结构

```
_config.yml          Hexo 主配置（站点信息、URL、插件）
_config.next.yml     NexT 主题配置
scaffolds/           新建文章的模板
source/
  _posts/            文章
  about|tags|categories/  独立页面
  images/            站点图片（文章配图也放这里）
.github/workflows/deploy.yml   自动部署
```

## 部署

`main` 分支 push 后自动触发 `.github/workflows/deploy.yml`：

1. `npm ci`
2. `npx hexo generate`
3. 上传 `public/` 并发布到 GitHub Pages

仓库 Settings → Pages → Source 需设置为 **GitHub Actions**。
