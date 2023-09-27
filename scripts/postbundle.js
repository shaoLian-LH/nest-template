const path = require('path');
const fs = require('fs-extra')

const copySwaggerUIDist = () => {
	const swaggerUIDist = path.join(__dirname, '../node_modules/swagger-ui-dist');
	const swaggerUIDistDest = path.join(__dirname, '../build/swagger-ui-dist');
	fs.readdirSync(swaggerUIDist).forEach(file => {
		const validEndings = ['.js', '.css', '.png'];
		const ext = path.extname(file);
		if (validEndings.includes(ext)) {
			fs.copySync(
				path.join(swaggerUIDist, file),
				path.join(swaggerUIDistDest, file)
			);
		}
	})
}

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

copySwaggerUIDist();
copyConfigFromDist();