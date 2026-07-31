const fs = require('fs');
let code = fs.readFileSync('src/components/ui/discover-more-modal.tsx', 'utf-8');
const startMatch = '  const [period,   setPeriod]   = useState<Period>("weekly");';
const endMatch = 'function RolesTab() {';
const startIndex = code.indexOf(startMatch);
const endIndex = code.indexOf(endMatch);
if (startIndex !== -1 && endIndex !== -1) {
  const actualStart = code.lastIndexOf('\n', startIndex);
  code = code.substring(0, actualStart) + '\n\n' + code.substring(endIndex);
  fs.writeFileSync('src/components/ui/discover-more-modal.tsx', code);
  console.log('Fixed duplicate code');
} else {
  console.log('Could not find markers', startIndex, endIndex);
}
