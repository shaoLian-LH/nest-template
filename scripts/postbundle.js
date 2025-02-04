const path = require('path');
const fs = require('fs-extra')

const copyConfigFromDist = () => {
	const config = path.join(__dirname, '../dist/config');
	const configDest = path.join(__dirname, '../build/config');
	fs.readdirSync(config, { recursive: true }).forEach(file => {
		const validEndings = ['.js', '.json'];
		const ext = path.extname(file);
		if (validEndings.includes(ext)) {
			fs.copySync(
				path.join(config, file),
				path.join(configDest, file)
			);
		}
	})
}

const patchNodeFileToRootDir = () => {
	const bundleClientDist = path.join(__dirname, '../build/client');
	const rootDir = path.join(__dirname, '../build');
	fs.readdirSync(bundleClientDist).forEach(file => {
		fs.copySync(path.join(bundleClientDist, file), path.join(rootDir, file));
	})
	fs.removeSync(bundleClientDist);
}

copyConfigFromDist();
patchNodeFileToRootDir();