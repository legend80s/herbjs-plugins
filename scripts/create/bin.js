const chalk = require('chalk');
const inquirer = require('inquirer');
const _ = require('lodash');
const path = require('path');
const glob = require('glob');
const fse = require('fs-extra');

const destRoot = path.join(__dirname, '..', '..', 'packages');
const tpl = path.join(__dirname, 'tpl');

(async () => {
  const { package } = await inquirer.prompt([
    {
      type: 'input',
      name: 'package',
      message: '输入要创建的模块名',
      validate(input) {
        return !!input && !!input.trim();
      },
    },
  ]);

  const dest = path.join(destRoot, package);

  const exists = await fse.exists(dest);

  if (exists) {
    console.log(chalk.red(`模块 "${package}" 已存在，请勿重复创建！`));
    return;
  }

  const files = glob.sync(path.join(tpl, '**', '*'), {
    nodir: true,
  });
  const templateOptions = {
    package,
  };

  for (const file of files) {
    const content = await fse.readFile(file, 'utf-8');
    const relativeName = path.relative(tpl, file);
    const filepath = path.join(dest, relativeName);

    const compiled = _.template(content)(templateOptions);
    await fse.ensureFile(filepath);
    await fse.writeFile(filepath, compiled);
    console.log(chalk.grey(`"${relativeName}" 写入成功！`));
  }

  console.log(chalk.green(`模块 "${package}" 创建成功！`));
})();
