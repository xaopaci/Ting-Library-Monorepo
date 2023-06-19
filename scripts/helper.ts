import { execa } from 'execa'
import prompts = require('prompts')

type WorkspacePackage = { name: string; version?: string; path: string }
// 获取所有子项目的信息 as WorkspacePackage （筛选需要打包的子项目）
async function getPackages() {
  const { stdout } = await execa('pnpm', ['ls', '-r', '--depth', '-1', '--json'])
  return (JSON.parse(stdout) as WorkspacePackage[]).filter(
    (p) => p.name !== 'ting-library-monorepo' && p.name !== 'scripts' && p.name.startsWith('@apps')
  )
}

async function runScript(pkg: WorkspacePackage, script: string) {
  execa('pnpm', ['--filter', `${pkg.name}...`, '--parallel', script], {
    stdio: 'inherit',
    preferLocal: true
  })
}

async function runSingleScript(pkg: WorkspacePackage, script: string) {
  execa('pnpm', ['--filter', `${pkg.name}`, script], {
    stdio: 'inherit',
    preferLocal: true
  })
}

export async function run(command: string) {
  const main = async () => {
    const packages = await getPackages()
    if (!packages.length) {
      return
    }

    if (packages.length === 1) {
      runSingleScript(packages[0], command)
      return
    }

    const { name } = await prompts([
      {
        name: 'name',
        message: `Choose the package to run ${command} script`,
        type: 'select',
        choices: packages.map((p) => {
          return {
            title: p.name,
            value: p.name
          }
        })
      }
    ])

    runScript(
      packages.find((p) => p.name === name),
      command
    )
  }

  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
