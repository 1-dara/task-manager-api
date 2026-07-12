import { execSync } from 'child_process';

export default async function setup() {
    execSync('npx prisma generate', { stdio: 'inherit' });
}
