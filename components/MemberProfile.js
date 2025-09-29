import React, { useState, useEffect } from 'react';
import { Position, Club } from '../types.js';
import ChevronLeftIcon from './icons/ChevronLeftIcon.js';
import ChevronDownIcon from './icons/ChevronDownIcon.js';
import TrashIcon from './icons/TrashIcon.js';
import PencilIcon from './icons/PencilIcon.js';

const MemberProfile = ({ member, onBack, onUpdate, onDelete, currentUserRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState(member);
  
  const [newNoteContent, setNewNoteContent] = useState('');
  
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventStartDate, setNewEventStartDate] = useState('');
  const [newEventEndDate, setNewEventEndDate] = useState('');
  const [openEventId, setOpenEventId] = useState(null);

  const [isAttendanceEditing, setIsAttendanceEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    setEditedMember(member);
    // Reset editing states if the member prop changes
    setIsEditing(false);
    setIsAttendanceEditing(false);
    setEditingEventId(null);
  }, [member]);
  
  const isAdmin = currentUserRole === Position.ADMIN;

  const handleSaveDetails = () => {
    onUpdate(editedMember);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedMember(member);
    setIsEditing(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setEditedMember(prev => ({...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
  }

  const handleAttendanceChange = (date, present) => {
    const updatedAttendance = editedMember.attendance.map(att =>
      att.date === date ? { ...att, present } : att
    );
    setEditedMember(prev => ({ ...prev, attendance: updatedAttendance }));
  };

  const handleSaveAttendance = () => {
    if (window.confirm('هل أنت متأكد من حفظ تغييرات الحضور؟')) {
      onUpdate(editedMember);
      setIsAttendanceEditing(false);
    }
  };

  const handleCancelAttendance = () => {
    setEditedMember(member);
    setIsAttendanceEditing(false);
  };
  
  const handleSpecialEventAttendanceChange = (eventId, date, present) => {
    const updatedEvents = editedMember.specialEvents.map(event => {
        if (event.id === eventId) {
            const updatedAttendance = event.attendance.map(att => 
                att.date === date ? { ...att, present } : att
            );
            return { ...event, attendance: updatedAttendance };
        }
        return event;
    });
    setEditedMember(prev => ({ ...prev, specialEvents: updatedEvents }));
  };

  const handleSaveSpecialEventAttendance = () => {
    if (window.confirm('هل أنت متأكد من حفظ تغييرات حضور الفعالية؟')) {
      onUpdate(editedMember);
      setEditingEventId(null);
    }
  };

  const handleCancelSpecialEventAttendance = () => {
    setEditedMember(member);
    setEditingEventId(null);
  };

  const handleAddSpecialEvent = () => {
    if (!newEventName.trim() || !newEventStartDate || !newEventEndDate) return;
    if (new Date(newEventStartDate) > new Date(newEventEndDate)) {
        alert("تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء.");
        return;
    }

    const attendanceDays = [];
    let currentDate = new Date(newEventStartDate);
    const endDate = new Date(newEventEndDate);

    while (currentDate <= endDate) {
        attendanceDays.push({ date: currentDate.toISOString(), present: false });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const newEvent = {
        id: crypto.randomUUID(),
        name: newEventName.trim(),
        startDate: new Date(newEventStartDate).toISOString(),
        endDate: new Date(newEventEndDate).toISOString(),
        attendance: attendanceDays,
    };
    onUpdate({ ...editedMember, specialEvents: [...editedMember.specialEvents, newEvent] });
    setNewEventName('');
    setNewEventStartDate('');
    setNewEventEndDate('');
    setShowAddEvent(false);
  };

  const handleDeleteSpecialEvent = (eventId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفعالية الخاصة؟')) {
        const updatedEvents = editedMember.specialEvents.filter(event => event.id !== eventId);
        onUpdate({ ...editedMember, specialEvents: updatedEvents });
    }
  };

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;
    const newNote = {
        id: crypto.randomUUID(),
        content: newNoteContent.trim(),
        date: new Date().toISOString(),
    };
    onUpdate({ ...editedMember, notes: [newNote, ...editedMember.notes] });
    setNewNoteContent('');
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
        const updatedNotes = editedMember.notes.filter(note => note.id !== noteId);
        onUpdate({ ...editedMember, notes: updatedNotes });
    }
  };
  
  const groupAttendanceByMonth = (attendance) => {
    return attendance.reduce((acc, att) => {
      const month = new Date(att.date).toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(att);
      return acc;
    }, {});
  };
  
  const groupedAttendance = groupAttendanceByMonth(member.attendance);
  const attendancePercentage = () => {
    const total = member.attendance.length;
    if (total === 0) return 0;
    const presentCount = member.attendance.filter(a => a.present).length;
    return ((presentCount / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <ChevronLeftIcon className="transform scale-x-[-1] h-5 w-5"/>
          <span>العودة إلى القائمة</span>
        </button>
        {isAdmin && (
             <button onClick={() => onDelete(member.id)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
               <TrashIcon />
               <span>حذف العضو</span>
             </button>
        )}
      </div>

      {/* Member Info Card */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-start">
            <div>
                 {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="firstName" value={editedMember.firstName} onChange={handleInputChange} placeholder="الاسم" className="p-2 border rounded"/>
                        <input name="lastName" value={editedMember.lastName} onChange={handleInputChange} placeholder="اللقب" className="p-2 border rounded"/>
                        <input name="age" type="number" value={editedMember.age} onChange={handleInputChange} placeholder="العمر" className="p-2 border rounded"/>
                        <input name="enrollmentYear" type="number" value={editedMember.enrollmentYear} onChange={handleInputChange} placeholder="سنة الانخراط" className="p-2 border rounded"/>
                        <input name="phone1" value={editedMember.phone1} onChange={handleInputChange} placeholder="رقم الهاتف 1" className="p-2 border rounded"/>
                        <input name="phone2" value={editedMember.phone2 || ''} onChange={handleInputChange} placeholder="رقم الهاتف 2" className="p-2 border rounded"/>
                        <select name="position" value={editedMember.position} onChange={handleInputChange} className="p-2 border rounded bg-white">
                          {Object.values(Position).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <select name="club" value={editedMember.club} onChange={handleInputChange} className="p-2 border rounded bg-white">
                          {Object.values(Club).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-gray-800">{member.firstName} {member.lastName}</h2>
                        <p className="text-lg text-gray-600 mt-1">{member.position}</p>
                        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-500">
                            <p><strong>العمر:</strong> {member.age} سنة</p>
                            <p><strong>سنة الانخراط:</strong> {member.enrollmentYear}</p>
                            <p><strong>النادي:</strong> {member.club || Club.NONE}</p>
                            <p><strong>الهاتف 1:</strong> {member.phone1}</p>
                            {member.phone2 && <p><strong>الهاتف 2:</strong> {member.phone2}</p>}
                            <p><strong>تاريخ الانضمام:</strong> {new Date(member.joinDate).toLocaleDateString('ar-EG')}</p>
                        </div>
                   </>
                )}
            </div>
             {isAdmin && (
                 <div className="flex-shrink-0">
                    {isEditing ? (
                        <div className="flex gap-2">
                             <button onClick={handleSaveDetails} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">حفظ</button>
                             <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">إلغاء</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                            <PencilIcon />
                        </button>
                    )}
                 </div>
            )}
        </div>
      </div>

      {/* Attendance Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">سجل الحضور (كل يوم جمعة)</h3>
            <div className="flex items-center gap-4">
              <div className="text-lg font-bold text-blue-600">
                  <span>نسبة الحضور: </span>
                  <span>%{attendancePercentage()}</span>
              </div>
              {isAdmin && (
                isAttendanceEditing ? (
                  <div className="flex gap-2">
                    <button onClick={handleSaveAttendance} className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">حفظ</button>
                    <button onClick={handleCancelAttendance} className="px-3 py-1 text-sm bg-gray-300 rounded-lg hover:bg-gray-400">إلغاء</button>
                  </div>
                ) : (
                  <button onClick={() => setIsAttendanceEditing(true)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">تعديل</button>
                )
              )}
            </div>
        </div>
        <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
          {Object.entries(groupedAttendance).map(([month, attendances]) => (
            <div key={month}>
                <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">{month}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(isAttendanceEditing ? editedMember.attendance : member.attendance)
                    .filter(att => new Date(att.date).toLocaleString('ar-EG', { month: 'long', year: 'numeric' }) === month)
                    .map((att) => (
                    <label key={att.date} className={`flex items-center p-3 bg-gray-50 rounded-md transition-colors ${isAttendanceEditing ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default'}`}>
                      <input
                        type="checkbox"
                        checked={att.present}
                        disabled={!isAttendanceEditing}
                        onChange={(e) => handleAttendanceChange(att.date, e.target.checked)}
                        className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                      />
                      <span className="ms-3 text-sm font-medium text-gray-700">
                        {new Date(att.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                      </span>
                    </label>
                  ))}
                </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Special Events Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">الفعاليات الخاصة</h3>
            {isAdmin && !showAddEvent && <button onClick={() => setShowAddEvent(true)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">إضافة فعالية</button>}
        </div>
        
        {isAdmin && showAddEvent && (
            <div className="p-4 bg-gray-50 rounded-lg mb-4 space-y-4">
              <div>
                  <label className="block text-sm font-medium">اسم الفعالية</label>
                  <input value={newEventName} onChange={e => setNewEventName(e.target.value)} className="w-full p-2 border rounded mt-1"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium">تاريخ البدء</label>
                      <input type="date" value={newEventStartDate} onChange={e => setNewEventStartDate(e.target.value)} className="w-full p-2 border rounded mt-1"/>
                  </div>
                  <div>
                      <label className="block text-sm font-medium">تاريخ الانتهاء</label>
                      <input type="date" value={newEventEndDate} onChange={e => setNewEventEndDate(e.target.value)} className="w-full p-2 border rounded mt-1"/>
                  </div>
              </div>
              <div className="flex gap-2 justify-end">
                  <button onClick={handleAddSpecialEvent} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">إضافة</button>
                  <button onClick={() => setShowAddEvent(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">إلغاء</button>
              </div>
            </div>
        )}

        <div className="space-y-3">
             {member.specialEvents.length > 0 ? member.specialEvents.map(event => {
                const isThisEventEditing = editingEventId === event.id;
                const eventToShow = isThisEventEditing ? editedMember.specialEvents.find(e => e.id === event.id) : event;
                if (!eventToShow) return null;

                return (
               <div key={event.id} className="bg-gray-50 rounded-md border">
                    <div className="flex items-center p-3 cursor-pointer" onClick={() => !isThisEventEditing && setOpenEventId(openEventId === event.id ? null : event.id)}>
                        <span className="font-medium text-gray-700 flex-grow">{event.name}</span>
                        <span className="text-xs text-gray-500 mx-4">{new Date(event.startDate).toLocaleDateString('ar-EG')} - {new Date(event.endDate).toLocaleDateString('ar-EG')}</span>
                        {isAdmin && (
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteSpecialEvent(event.id); }} className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100">
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        )}
                        <ChevronDownIcon className={`h-5 w-5 transition-transform ms-2 ${openEventId === event.id ? 'rotate-180' : ''}`} />
                    </div>
                    {openEventId === event.id && (
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-semibold">تسجيل الحضور اليومي:</h5>
                              {isAdmin && (
                                isThisEventEditing ? (
                                  <div className="flex gap-2">
                                    <button onClick={handleSaveSpecialEventAttendance} className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">حفظ</button>
                                    <button onClick={handleCancelSpecialEventAttendance} className="px-3 py-1 text-sm bg-gray-300 rounded-lg hover:bg-gray-400">إلغاء</button>
                                  </div>
                                ) : (
                                  <button onClick={() => setEditingEventId(event.id)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">تعديل</button>
                                )
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {eventToShow.attendance.map(att => (
                                <label key={att.date} className={`flex items-center p-2 bg-white rounded-md border ${isThisEventEditing ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default'}`}>
                                    <input
                                        type="checkbox"
                                        checked={att.present}
                                        disabled={!isThisEventEditing}
                                        onChange={(e) => handleSpecialEventAttendanceChange(event.id, att.date, e.target.checked)}
                                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                                    />
                                    <span className="ms-2 text-xs text-gray-700">{new Date(att.date).toLocaleDateString('ar-EG', {day: 'numeric', month: 'short'})}</span>
                                </label>
                            ))}
                            </div>
                        </div>
                    )}
               </div>
                )
             }) : <p className="text-gray-500">لا توجد فعاليات خاصة مسجلة.</p>}
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">دفتر الملاحظات</h3>
        <div className="mb-6">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="اكتب ملاحظة جديدة هنا..."
            />
            <div className="mt-2 text-left">
              <button 
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                إضافة ملاحظة
              </button>
            </div>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {member.notes.length > 0 ? member.notes.map(note => (
              <div key={note.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                  <span>{new Date(note.date).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  <button onClick={() => handleDeleteNote(note.id)} className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100">
                      <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">لا توجد ملاحظات مسجلة.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;