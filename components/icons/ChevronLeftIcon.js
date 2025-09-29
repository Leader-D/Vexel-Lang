import React from 'react';

function ChevronLeftIcon(props) {
  return React.createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      className: 'h-6 w-6',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      strokeWidth: 2,
      ...props,
    },
    React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      d: 'M9 5l7 7-7 7',
    })
  );
}

export default ChevronLeftIcon;