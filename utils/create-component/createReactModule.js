const mkdirp = require('mkdirp');
const cmd = require('node-cmd');

const writeModuleFiles = require('./writeModuleFiles');
const getPascalCaseName = require('./nameUtils').getPascalCaseName;
const getTitleCaseName = require('./nameUtils').getTitleCaseName;

const packageJson = require('./templates/react/packageJson');
const component = require('./templates/react/component');
const index = require('./templates/react/index');
const stories = require('./templates/react/stories');
const testingStories = require('./templates/react/stories_VisualTesting');
const ssr = require('./templates/react/SSR');
const readme = require('./templates/react/readme');
const tsconfig = require('./templates/react/tsconfig');

const cwd = process.cwd();

module.exports = (modulePath, name, description, unstable, public, category) => {
  const moduleName = `@workday/canvas-kit-${unstable ? 'labs-' : ''}react-${name}`;

  console.log('\nCreating ' + `${moduleName}\n`.blue.underline);

  mkdirp.sync(modulePath);

  const pascalCaseName = getPascalCaseName(name);
  const titleCaseName = getTitleCaseName(name);
  const rootPath = unstable ? '../../../..' : '../../..';
  const storyPath = `${unstable ? 'Labs|' : `Components|${category}/`}${titleCaseName}/React`;
  const testingStoryPath = `Testing|React/${unstable ? 'Labs' : category}/${titleCaseName}`;

  const files = {
    package: {
      path: 'package.json',
      contents: packageJson(name, moduleName, description, unstable, public),
    },
    component: {
      path: `lib/${pascalCaseName}.tsx`,
      contents: component(pascalCaseName),
    },
    index: {
      path: 'index.ts',
      contents: index(pascalCaseName),
    },
    stories: {
      path: 'stories/stories.tsx',
      contents: stories(storyPath, pascalCaseName, rootPath),
    },
    testingStories: {
      path: 'stories/stories_VisualTesting.tsx',
      contents: testingStories(testingStoryPath, pascalCaseName, rootPath),
    },
    ssr: {
      path: 'spec/SSR.spec.tsx',
      contents: ssr(pascalCaseName),
    },
    readme: {
      path: 'README.md',
      contents: readme(name, description, unstable),
    },
    tsconfig: {
      path: 'tsconfig.json',
      contents: tsconfig.default(rootPath),
    },
    tsconfigCjs: {
      path: 'tsconfig.cjs.json',
      contents: tsconfig.cjs(),
    },
    tsconfigEs6: {
      path: 'tsconfig.es6.json',
      contents: tsconfig.es6(),
    },
  };

  writeModuleFiles(files, modulePath);

  console.log('Copying License file to ' + `.${modulePath.replace(cwd, '')}/LICENSE`.cyan);
  cmd.run(`cp ${cwd}/LICENSE ${modulePath}/LICENSE`);
};
