import React from 'react';
import { Position, Club } from '../types.js';

function AddMemberModal({ isOpen, onClose, onAddMember }) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [enrollmentYear, setEnrollmentYear] = React.useState('');
  const [phone1, setPhone1] = React.useState('');
  const [phone2, setPhone2] = React.useState('');
  const [position, setPosition] = React.useState(Position.FTY);
  const [club, setClub] = React.useState(Club.NONE);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim() && age && enrollmentYear && phone1) {
      onAddMember({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: parseInt(age),
        enrollmentYear: parseInt(enrollmentYear),
        phone1,
        phone2,
        position,
        club,
      });
      setFirstName('');
      setLastName('');
      setAge('');
      setEnrollmentYear('');
      setPhone1('');
      setPhone2('');
      setPosition(Position.FTY);
      setClub(Club.NONE);
    }
  };

  return React.createElement(
    'div',
    {
      className: 'fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4',
      onClick: onClose,
    },
    React.createElement(
      'div',
      {
        className: 'bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-lg transform transition-all',
        onClick: (e) => e.stopPropagation(),
      },
      React.createElement(
        'h2',
        { className: 'text-2xl font-bold mb-6 text-gray-800' },
        'إضافة عضو جديد'
      ),
      React.createElement(
        'form',
        { onSubmit: handleSubmit, className: 'space-y-4' },
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
          ['firstName', 'lastName', 'age', 'enrollmentYear', 'phone1', 'phone2'].map((field, index) =>
            React.createElement(
              'div',
              { key: field },
              React.createElement(
                'label',
                {
                  htmlFor: field,
                  className: 'block text-sm font-medium text-gray-700 mb-1',
                },
                field === 'phone2'
                  ? 'رقم الهاتف الثاني '
                  : field === 'firstName'
                  ? 'الاسم'
                  : field === 'lastName'
                  ? 'اللقب'
                  : field === 'age'
                  ? 'العمر'
                  : field === 'enrollmentYear'
                  ? 'سنة الانخراط'
                  : 'رقم الهاتف الأول',
                field === 'phone2' &&
                  React.createElement(
                    'span',
                    { className: 'text-gray-400' },
                    '(اختياري)'
                  )
              ),
              React.createElement('input', {
                type: field === 'age' || field === 'enrollmentYear' ? 'number' : field.includes('phone') ? 'tel' : 'text',
                id: field,
                value:
                  field === 'firstName'
                    ? firstName
                    : field === 'lastName'
                    ? lastName
                    : field === 'age'
                    ? age
                    : field === 'enrollmentYear'
                    ? enrollmentYear
                    : field === 'phone1'
                    ? phone1
                    : phone2,
                onChange: (e) =>
                  field === 'firstName'
                    ? setFirstName(e.target.value)
                    : field === 'lastName'
                    ? setLastName(e.target.value)
                    : field === 'age'
                    ? setAge(e.target.value)
                    : field === 'enrollmentYear'
                    ? setEnrollmentYear(e.target.value)
                    : field === 'phone1'
                    ? setPhone1(e.target.value)
                    : setPhone2(e.target.value),
                className:
                  'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
                required: field !== 'phone2',
              })
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
          ['position', 'club'].map((field) =>
            React.createElement(
              'div',
              { key: field },
              React.createElement(
                'label',
                {
                  htmlFor: field,
                  className: 'block text-sm font-medium text-gray-700 mb-1',
                },
                field === 'position' ? 'المنصب' : 'النادي'
              ),
              React.createElement(
                'select',
                {
                  id: field,
                  value: field === 'position' ? position : club,
                  onChange: (e) =>
                    field === 'position'
                      ? setPosition(e.target.value)
                      : setClub(e.target.value),
                  className:
                    'w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
                },
                Object.values(field === 'position' ? Position : Club).map((val) =>
                  React.createElement('option', { key: val, value: val }, val)
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'flex justify-end gap-4 pt-4' },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: onClose,
              className:
                'px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors',
            },
            'إلغاء'
          ),
          React.createElement(
            'button',
            {
              type: 'submit',
              className:
                'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
            },
            'إضافة العضو'
          )
        )
      )
    )
  );
}

export default AddMemberModal;