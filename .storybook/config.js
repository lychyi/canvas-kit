import {configure, addDecorator, addParameters, forceReRender} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs/react';
import {injectGlobal} from 'emotion';
import fonts from '../modules/fonts/react';
import {create} from '@storybook/theming';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import {toId} from '@storybook/router';
import ReactDOM from 'react-dom';

import {commonColors, typeColors, fontFamily} from '../modules/core/react';
import {InputProviderDecorator} from '../utils/storybook';

function loadStories() {
  const react = require.context('../modules', true, /react\/stories.*\.tsx?$/);
  const css = require.context('../modules', true, /css\/stories.*\.tsx?$/);
  const labs = require.context('../modules/_labs', true, /stories.*\.tsx?$/);

  // Loading order is the order in which stories appear
  // When we update to Storybook 5.2, then we can sort as an option param in `addParameters` below
  react
    .keys()
    .filter(key => !/_labs/.test(key))
    .forEach(key => react(key));
  css
    .keys()
    .filter(key => !/_labs/.test(key))
    .forEach(key => css(key));
  labs.keys().forEach(key => labs(key));
}

addDecorator(withKnobs);
addDecorator(InputProviderDecorator);

addParameters({
  options: {
    theme: create({
      brandTitle: 'Canvas Kit',
      mainTextColor: typeColors.body,
      mainTextFace: fontFamily,
      mainBackground: commonColors.backgroundAlt,
    }),
  },
});

addParameters({
  readme: {
    codeTheme: 'github',
  },
});

configure(loadStories, module);
injectGlobal(...fonts);

function setCurrentStory(categorization, story) {
  clearCurrentStory();
  addons.getChannel().emit(Events.SET_CURRENT_STORY, {
    storyId: toId(categorization, story),
  });
  forceReRender();
}

function clearCurrentStory() {
  var root = document.querySelector('#root');
  ReactDOM.unmountComponentAtNode(root);
}

window.setCurrentStory = setCurrentStory;
