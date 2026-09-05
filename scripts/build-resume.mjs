import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'

const root = process.cwd()
const inputPath = path.join(root, 'data', 'resume.yaml')
const outputPath = path.join(root, 'public', 'resume.json')

const yamlText = fs.readFileSync(inputPath, 'utf8')
const data = YAML.parse(yamlText)

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8')

console.log(`resume.json built from ${inputPath}`)
