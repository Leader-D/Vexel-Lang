import React from 'react';
import PlusIcon from './icons/PlusIcon.js';

function Header({ onAddMemberClick, showAddButton }) {
  return React.createElement(
    'header',
    { className: 'bg-white shadow-md' },
    React.createElement(
      'div',
      {
        className:
          'container mx-auto px-4 md:px-8 py-4 flex justify-between items-center',
      },
      React.createElement(
        'h1',
        { className: 'text-2xl md:text-3xl font-bold text-blue-600' },
        'منتدى الفتية - ادارة الاعضاء'
      ),
      showAddButton &&
        React.createElement(
          'button',
          {
            onClick: onAddMemberClick,
            className:
              'flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors',
          },
          React.createElement(PlusIcon, null),
          React.createElement('span', null, 'إضافة عضو')
        )
    )
  );
}

export default Header;