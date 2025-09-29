import React from 'react';
import TrashIcon from './icons/TrashIcon.js';
import UserIcon from './icons/UserIcon.js';

function MemberList({ members, onSelectMember, onDeleteMember }) {
  if (members.length === 0) {
    return React.createElement(
      'div',
      { className: 'text-center py-16' },
      React.createElement(UserIcon, {
        className: 'mx-auto h-24 w-24 text-gray-400',
      }),
      React.createElement(
        'h2',
        { className: 'mt-4 text-2xl font-semibold text-gray-600' },
        'لا يوجد أعضاء بعد'
      ),
      React.createElement(
        'p',
        { className: 'mt-2 text-gray-500' },
        'ابدأ بإضافة عضو جديد لعرضه في القائمة.'
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'bg-white rounded-lg shadow-lg overflow-hidden' },
    React.createElement(
      'div',
      { className: 'overflow-x-auto' },
      React.createElement(
        'table',
        { className: 'min-w-full divide-y divide-gray-200' },
        React.createElement(
          'thead',
          { className: 'bg-gray-50' },
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              {
                scope: 'col',
                className:
                  'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider',
              },
              'الاسم الكامل'
            ),
            React.createElement(
              'th',
              {
                scope: 'col',
                className:
                  'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider',
              },
              'المنصب'
            ),
            React.createElement(
              'th',
              {
                scope: 'col',
                className:
                  'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider',
              },
              'تاريخ الانضمام'
            ),
            React.createElement(
              'th',
              {
                scope: 'col',
                className: 'relative px-6 py-3',
              },
              React.createElement(
                'span',
                { className: 'sr-only' },
                'إجراءات'
              )
            )
          )
        ),
        React.createElement(
          'tbody',
          { className: 'bg-white divide-y divide-gray-200' },
          members.map((member) =>
            React.createElement(
              'tr',
              {
                key: member.id,
                className: 'hover:bg-gray-50 transition-colors',
              },
              React.createElement(
                'td',
                { className: 'px-6 py-4 whitespace-nowrap' },
                React.createElement(
                  'div',
                  { className: 'text-sm font-medium text-gray-900' },
                  `${member.firstName} ${member.lastName}`
                )
              ),
              React.createElement(
                'td',
                { className: 'px-6 py-4 whitespace-nowrap' },
                React.createElement(
                  'span',
                  {
                    className:
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
                  },
                  member.position
                )
              ),
              React.createElement(
                'td',
                {
                  className:
                    'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
                },
                new Date(member.joinDate).toLocaleDateString('ar-EG')
              ),
              React.createElement(
                'td',
                {
                  className:
                    'px-6 py-4 whitespace-nowrap text-left text-sm font-medium',
                },
                React.createElement(
                  'div',
                  {
                    className:
                      'flex items-center justify-end gap-x-4',
                  },
                  React.createElement(
                    'button',
                    {
                      onClick: () => onSelectMember(member),
                      className:
                        'text-blue-600 hover:text-blue-900 transition-colors',
                      title: 'عرض الملف الشخصي',
                    },
                    'عرض الملف الشخصي'
                  ),
                  React.createElement(
                    'button',
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        onDeleteMember(member.id);
                      },
                      className:
                        'text-red-600 hover:text-red-900 transition-colors',
                      title: 'حذف العضو',
                    },
                    React.createElement(TrashIcon, null)
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

export default MemberList;