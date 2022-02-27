const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,tsx,html}'),
    'libs/ui-common/src/**/*.{ts,tsx,html}',
    'libs/ui-kanban/src/**/*.{ts,tsx,html}',
    'libs/forms/src/**/*.{ts,tsx,html}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  important: true,
  theme: {
    extend: {
      height: () => ({
        'screen/2': '50vh',
        'screen/3': 'calc(100vh / 3)',
        'screen/4': 'calc(100vh / 4)',
        'screen/5': 'calc(100vh / 5)',
        'screen-90': '90vh',
        'screen-80': '80vh',
        'full-minus-nav': 'calc(100vh - 78px)',
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
