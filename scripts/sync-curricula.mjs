// Fetches the pinned `curricula` revision into .cache/curricula (gitignored).
// The portal never commits curriculum content; this cache is build input only.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lock = JSON.parse(readFileSync(resolve(root, 'curricula.lock.json'), 'utf8'));
const dest = resolve(root, '.cache', 'curricula');
const git = (args, cwd) => execFileSync('git', args, { cwd, stdio: 'inherit' });

if (!/^[0-9a-f]{40}$|^v?\d+\.\d+\.\d+/.test(lock.ref)) {
  throw new Error(
    `curricula.lock.json "ref" must be a full commit SHA or a version tag: ${lock.ref}`,
  );
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
git(['init', '-q'], dest);
git(['remote', 'add', 'origin', lock.repo], dest);
git(['fetch', '-q', '--depth', '1', 'origin', lock.ref], dest);
git(['checkout', '-q', 'FETCH_HEAD'], dest);
writeFileSync(
  resolve(dest, '.owc-source.json'),
  JSON.stringify({ repo: lock.repo, ref: lock.ref }, null, 2),
);
if (!existsSync(resolve(dest, 'README.md'))) throw new Error('Sync produced an empty checkout');
console.log(`curricula @ ${lock.ref} -> ${dest}`);
