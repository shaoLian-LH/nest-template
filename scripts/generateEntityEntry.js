const { join } = require('path');
const fs = require('fs-extra');

const generateEntityEntry = () => {
	const entityEntry = join(__dirname, '../src/entities/index.ts');
	const entityDir = join(__dirname, '../src/entities');

	const tip =
		'// 本文件通过 scripts/generateEntityEntry.js 自动生成，请勿手动修改\n\n';
	let newImports = '';
	let importEntities = [];

	fs.readdirSync(entityDir, {
		encoding: 'utf-8',
		recursive: true,
	}).forEach((file) => {
		if (
			file.includes('.ts') &&
			!file.includes('.d.ts') &&
			!file.includes('index')
		) {
			const fileContent = fs.readFileSync(join(entityDir, file), {
				encoding: 'utf-8',
			});
			const exportedClass = fileContent.match(/export class (\w+)/);
			if (!exportedClass) {
				return;
			}

			const importTarget = exportedClass[1];
			importEntities.push(importTarget);

			const fileWithoutExt = file.replace('.ts', '');
			newImports += `import { ${importTarget} } from './${fileWithoutExt}';\n`;
		}
	});

	const newContent = `${tip}${newImports}\nexport default [\n\t${importEntities.join(
		',\n\t',
	)}\n];\n`;

	fs.writeFileSync(entityEntry, newContent);
};

generateEntityEntry();
