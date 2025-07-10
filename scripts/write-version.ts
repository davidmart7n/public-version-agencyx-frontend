// scripts/write-version.ts
import { writeFileSync } from "fs"

const versionData = {
  version: process.env.npm_package_version || "0.0.1",
  timestamp: new Date().toISOString()
}

writeFileSync("public/version.json", JSON.stringify(versionData, null, 2))

console.log("✅ Archivo version.json generado:", versionData)
