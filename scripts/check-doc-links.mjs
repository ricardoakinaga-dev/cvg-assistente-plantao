import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const markdown = []
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(entry.name)) continue
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (entry.isFile() && file.endsWith('.md')) markdown.push(file)
  }
}
walk(root)

const broken = []
for (const file of markdown) {
  const content = readFileSync(file, 'utf8')
  for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().split(/[\s#]/, 1)[0]
    if (!target || /^(?:https?:|mailto:|data:)/i.test(target)) continue
    const decoded = decodeURIComponent(target)
    const resolved = path.resolve(path.dirname(file), decoded)
    if (!resolved.startsWith(root + path.sep) && resolved !== root) {
      broken.push({
        file: path.relative(root, file),
        target,
        reason: 'outside_repo'
      })
    } else if (!existsSync(resolved)) {
      broken.push({
        file: path.relative(root, file),
        target,
        reason: 'missing'
      })
    } else if (statSync(resolved).isDirectory()) {
      broken.push({
        file: path.relative(root, file),
        target,
        reason: 'directory_target'
      })
    }
  }
}

process.stdout.write(
  `${JSON.stringify({ markdownFiles: markdown.length, brokenLinks: broken }, null, 2)}\n`
)
if (broken.length) process.exitCode = 1
