const fs = require('fs');
const path = require('path');
const semver = require('semver');

const versionPath = path.join(__dirname, '../version.json');
const versionData = require(versionPath);
const currentVersion = versionData.version;

// Incrementa a versão de patch. Você pode alterar para 'minor' ou 'major'.
const newVersion = semver.inc(currentVersion, 'patch');

versionData.version = newVersion;

fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));

console.log(`Versão atualizada de ${currentVersion} para ${newVersion}`);
