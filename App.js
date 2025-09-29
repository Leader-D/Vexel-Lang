import React from 'react';
import { Position, Club } from './types.js';
import Header from './components/Header.js';
import MemberList from './components/MemberList.js';
import MemberProfile from './components/MemberProfile.js';
import AddMemberModal from './components/AddMemberModal.js';

const CURRENT_USER_ROLE = Position.ADMIN;

function App() {
  const [members, setMembers] = React.useState([]);
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const storedMembers = localStorage.getItem('members');
      if (storedMembers) {
        const parsedMembers = JSON.parse(storedMembers).map((member) => ({
          ...member,
          club: member.club || Club.NONE
        }));
        setMembers(parsedMembers);
      }
    } catch (error) {
      console.error("Failed to load members from local storage", error);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem('members', JSON.stringify(members));
    } catch (error) {
      console.error("Failed to save members to local storage", error);
    }
  }, [members]);

  const generateFridays = () => {
    const fridays = [];
    const today = new Date();
    const seasonStartYear = today.getMonth() < 6 ? today.getFullYear() - 1 : today.getFullYear();
    let startDate = new Date(seasonStartYear, 9, 1);
    const endDate = new Date(seasonStartYear + 1, 5, 30);
    let currentDate = new Date(startDate);
    while (currentDate.getDay() !== 5) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    while (currentDate <= endDate) {
      fridays.push({ date: currentDate.toISOString(), present: false });
      currentDate.setDate(currentDate.getDate() + 7);
    }
    return fridays;
  };

  const handleAddMember = (data) => {
    const newMember = {
      ...data,
      id: crypto.randomUUID(),
      joinDate: new Date().toISOString(),
      attendance: generateFridays(),
      specialEvents: [],
      notes: [],
    };
    setMembers((prev) => [...prev, newMember]);
    setIsModalOpen(false);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('هل أنت متأكد من أنك تريد حذف هذا العضو؟')) {
      setMembers((prev) => prev.filter((member) => member.id !== id));
      if (selectedMember?.id === id) {
        setSelectedMember(null);
      }
    }
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
  };

  const handleBackToList = () => {
    setSelectedMember(null);
  };

  const handleUpdateMember = React.useCallback((updatedMember) => {
    setMembers((prev) => prev.map((m) => (m.id === updatedMember.id ? updatedMember : m)));
    setSelectedMember(updatedMember);
  }, []);

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-50 text-gray-800' },
    React.createElement(Header, {
      onAddMemberClick: () => setIsModalOpen(true),
      showAddButton: !selectedMember,
    }),
    React.createElement(
      'main',
      { className: 'container mx-auto p-4 md:p-8' },
      selectedMember
        ? React.createElement(MemberProfile, {
            member: selectedMember,
            onBack: handleBackToList,
            onUpdate: handleUpdateMember,
            onDelete: handleDeleteMember,
            currentUserRole: CURRENT_USER_ROLE,
          })
        : React.createElement(MemberList, {
            members: members,
            onSelectMember: handleSelectMember,
            onDeleteMember: handleDeleteMember,
          })
    ),
    React.createElement(AddMemberModal, {
      isOpen: isModalOpen,
      onClose: () => setIsModalOpen(false),
      onAddMember: handleAddMember,
    })
  );
}

export default App;