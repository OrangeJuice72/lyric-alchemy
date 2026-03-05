import fs from 'fs';
import { execSync } from 'child_process';

try {
    const out = execSync('npx eslint src/', { encoding: 'utf-8' });
    fs.writeFileSync('lint_err.txt', out);
} catch (e) {
    fs.writeFileSync('lint_err.txt', e.stdout + '\n' + e.stderr);
}

try {
    const out = execSync('npm run build', { encoding: 'utf-8' });
    fs.writeFileSync('build_err.txt', out);
} catch (e) {
    fs.writeFileSync('build_err.txt', e.stdout + '\n' + e.stderr);
}
