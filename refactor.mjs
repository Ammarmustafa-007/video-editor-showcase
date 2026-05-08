import fs from 'fs';
import path from 'path';

const routesDir = './src/routes';
const sectionsDir = './src/components/sections';

if (!fs.existsSync(sectionsDir)) {
  fs.mkdirSync(sectionsDir, { recursive: true });
}

const files = fs.readdirSync(routesDir);

for (const file of files) {
  if (file === '__root.tsx' || file === 'index.tsx') continue;
  if (!file.endsWith('.tsx')) continue;

  const content = fs.readFileSync(path.join(routesDir, file), 'utf-8');
  
  // Remove the createFileRoute part
  let newContent = content.replace(/export const Route = createFileRoute\([\s\S]*?\}\);/, '');
  
  // Add export to the function
  newContent = newContent.replace(/function ([A-Za-z0-9_]+)\(/, 'export function $1(');
  
  // Add section wrapper based on filename
  // This is a bit tricky, let's just write the modified content first.
  const sectionName = file.replace('.tsx', '').replace('work.', '');
  
  // For each function component, we should wrap it's return in a section with id.
  // We can do this manually in index.tsx instead of modifying the component itself.
  
  fs.writeFileSync(path.join(sectionsDir, file), newContent);
  fs.unlinkSync(path.join(routesDir, file)); // delete the original route
}
