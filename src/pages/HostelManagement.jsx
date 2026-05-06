import React, { useState } from 'react';
import {
  Users, Home, DollarSign, Wrench,
  LogOut, AlertCircle, CheckCircle, Clock,
  Calendar, Phone, Info, Plus, Search,
  Activity, User, LayoutDashboard,
  Bell, X, FileText, Heart, BookOpen,
  Map, Coffee, Box, Shield, FileDown, ArrowRight, ClipboardList, LogIn
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- DATA GENERATION ---
const generateDummyData = () => {
  const rooms = [];
  for (let f = 1; f <= 3; f++) {
    for (let r = 1; r <= 10; r++) {
      const type = r <= 2 ? 'Single' : r <= 7 ? 'Double' : 'Triple';
      const capacity = type === 'Single' ? 1 : type === 'Double' ? 2 : 3;
      rooms.push({
        id: `R${f}${r.toString().padStart(2, '0')}`,
        roomNo: `${f}${r.toString().padStart(2, '0')}`,
        floor: f,
        type,
        capacity,
        occupants: [],
        status: 'Vacant'
      });
    }
  }

  const residents = [];
  let resId = 1;
  const names = [
    'Alex Johnson', 'Sam Smith', 'Jordan Lee', 'Casey Williams', 'Taylor Brown',
    'Morgan Davis', 'Riley Miller', 'Quinn Wilson', 'Avery Moore', 'Peyton Taylor',
    'Skyler Anderson', 'Cameron Thomas', 'Harper Jackson', 'Rowan White', 'Finley Harris'
  ];

  rooms.forEach(room => {
    if (resId > names.length) return;
    if (Math.random() > 0.3) {
      const numOccupants = Math.min(room.capacity, names.length - resId + 1);
      for (let i = 0; i < numOccupants; i++) {
        if (resId > names.length) break;
        const name = names[resId - 1];
        const statRand = Math.random();
        let paymentStatus = statRand > 0.8 ? 'Overdue' : statRand > 0.6 ? 'Pending' : 'Paid';

        residents.push({
          id: `S${resId}`,
          name,
          roomNo: room.roomNo,
          moveInDate: `2025-0${Math.floor(Math.random() * 5) + 1}-01`,
          contact: `555-01${resId.toString().padStart(2, '0')}`,
          guardianName: ['David', 'Sarah', 'Michael', 'Emma', 'Robert'][Math.floor(Math.random() * 5)] + ' ' + name.split(' ')[1],
          guardianContact: `555-09${resId.toString().padStart(2, '0')}`,
          course: ['Computer Science', 'Business Admin', 'Engineering', 'Architecture', 'Law'][Math.floor(Math.random() * 5)],
          bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'O-'][Math.floor(Math.random() * 5)],
          password: 'student123',
          paymentStatus,
          paymentHistory: [{
            month: 'May 2026',
            amount: room.capacity === 1 ? 800 : room.capacity === 2 ? 600 : 450,
            due: '2026-05-05',
            paid: paymentStatus === 'Paid' ? '2026-05-02' : null,
            status: paymentStatus,
            receiptNo: paymentStatus === 'Paid' ? `REC-${Date.now()}` : null
          }]
        });
        room.occupants.push(name);
        resId++;
      }
      room.status = 'Occupied';
    } else if (Math.random() > 0.8) {
      room.status = 'Maintenance';
    }
  });

  const notices = [
    { id: 1, title: 'Electricity Maintenance', message: 'Electricity will be cut off on 12th–13th May for maintenance work.', category: '⚡ Electricity', priority: 'Urgent', date: new Date().toISOString(), postedBy: 'Management' },
    { id: 2, title: 'Water Supply', message: 'Water supply disrupted 6–8 AM tomorrow.', category: '🔧 Maintenance', priority: 'Normal', date: new Date(Date.now() - 86400000).toISOString(), postedBy: 'Management' },
    { id: 3, title: 'Rent Reminder', message: 'Rent due by 5th of every month.', category: '📢 General', priority: 'Normal', date: new Date(Date.now() - 172800000).toISOString(), postedBy: 'Management' },
  ];

  const maintenance = [
    { id: 1, studentId: 'S1', studentName: names[0], roomNo: residents[0]?.roomNo || '101', category: 'Plumbing', description: 'Leaking faucet in bathroom', date: new Date().toISOString().split('T')[0], status: 'Pending' },
    { id: 2, studentId: 'S2', studentName: names[1], roomNo: residents[1]?.roomNo || '102', category: 'Electrical', description: 'AC not cooling properly', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: 'In Progress' }
  ];

  const gatePasses = [
    { id: 1, studentId: 'S1', studentName: names[0], fromDate: new Date().toISOString().split('T')[0], toDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], reason: 'Family event at home', status: 'Pending' }
  ];

  const roomRequests = [
    { id: 1, studentId: 'S2', studentName: names[1], currentRoom: residents[1]?.roomNo || '102', requestedType: 'Single', reason: 'Need quiet space for final year project', status: 'Pending' }
  ];

  const visitors = [
    { id: 1, visitorName: 'John Doe Sr.', studentId: 'S1', studentName: names[0], date: new Date().toISOString().split('T')[0], timeIn: '10:00 AM', timeOut: null, relation: 'Father' }
  ];

  const messMenu = [
    { id: 1, day: 'Monday', breakfast: 'Poha, Jalebi, Tea', lunch: 'Dal Makhani, Rice, Roti', dinner: 'Paneer Butter Masala, Roti' },
    { id: 2, day: 'Tuesday', breakfast: 'Aloo Paratha, Curd', lunch: 'Rajma Chawal, Salad', dinner: 'Mix Veg, Roti, Dal' },
    { id: 3, day: 'Wednesday', breakfast: 'Idli Sambar, Chutney', lunch: 'Kadhi Pakora, Rice', dinner: 'Chicken Curry / Paneer Bhurji' },
    { id: 4, day: 'Thursday', breakfast: 'Sandwich, Coffee', lunch: 'Chole Bhature', dinner: 'Aloo Gobi, Roti' },
    { id: 5, day: 'Friday', breakfast: 'Upma, Tea', lunch: 'Dal Tadka, Jeera Rice', dinner: 'Egg Curry / Malai Kofta' },
    { id: 6, day: 'Saturday', breakfast: 'Puri Sabzi', lunch: 'Veg Biryani, Raita', dinner: 'Chowmein, Manchurian' },
    { id: 7, day: 'Sunday', breakfast: 'Masala Dosa', lunch: 'Special Thali', dinner: 'Light Khichdi' },
  ];

  const inventory = [];
  rooms.forEach(r => {
    inventory.push({ id: `I${r.id}1`, roomNo: r.roomNo, item: 'Bed', condition: 'Good' });
    inventory.push({ id: `I${r.id}2`, roomNo: r.roomNo, item: 'Study Table', condition: 'Good' });
    inventory.push({ id: `I${r.id}3`, roomNo: r.roomNo, item: 'Chair', condition: Math.random() > 0.9 ? 'Damaged' : 'Good' });
    inventory.push({ id: `I${r.id}4`, roomNo: r.roomNo, item: 'Wardrobe', condition: 'Good' });
  });

  return { rooms, residents, notices, maintenance, gatePasses, roomRequests, visitors, messMenu, inventory };
};
const initialData = generateDummyData();


// --- MAIN APPLICATION COMPONENT ---
export default function HostelManagement() {
  const [currentUser, setCurrentUser] = useState(null);

  // App States
  const [rooms, setRooms] = useState(initialData.rooms);
  const [residents, setResidents] = useState(initialData.residents);
  const [notices, setNotices] = useState(initialData.notices);
  const [maintenance, setMaintenance] = useState(initialData.maintenance);
  const [gatePasses, setGatePasses] = useState(initialData.gatePasses);
  const [roomRequests, setRoomRequests] = useState(initialData.roomRequests);
  const [visitors, setVisitors] = useState(initialData.visitors);
  const [messMenu, setMessMenu] = useState(initialData.messMenu);
  const [inventory, setInventory] = useState(initialData.inventory);

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} residents={residents} />;
  }

  if (currentUser === 'owner') {
    return (
      <OwnerDashboard
        onLogout={() => setCurrentUser(null)}
        rooms={rooms} setRooms={setRooms}
        residents={residents} setResidents={setResidents}
        notices={notices} setNotices={setNotices}
        maintenance={maintenance} setMaintenance={setMaintenance}
        gatePasses={gatePasses} setGatePasses={setGatePasses}
        roomRequests={roomRequests} setRoomRequests={setRoomRequests}
        visitors={visitors} setVisitors={setVisitors}
        messMenu={messMenu} setMessMenu={setMessMenu}
        inventory={inventory} setInventory={setInventory}
      />
    );
  }

  return (
    <StudentDashboard
      student={currentUser}
      onLogout={() => setCurrentUser(null)}
      rooms={rooms}
      notices={notices}
      maintenance={maintenance} setMaintenance={setMaintenance}
      gatePasses={gatePasses} setGatePasses={setGatePasses}
      roomRequests={roomRequests} setRoomRequests={setRoomRequests}
      messMenu={messMenu}
      inventory={inventory}
    />
  );
}


// --- LOGIN SCREEN ---
function LoginScreen({ onLogin, residents }) {
  const [ownerUser, setOwnerUser] = useState('admin');
  const [ownerPass, setOwnerPass] = useState('admin123');
  const [studentId, setStudentId] = useState(residents[0]?.id || '');
  const [studentPass, setStudentPass] = useState('student123');
  const [error, setError] = useState('');

  const handleOwnerLogin = (e) => {
    e.preventDefault();
    if (ownerUser === 'admin' && ownerPass === 'admin123') {
      onLogin('owner');
      toast.success('Welcome back, Admin');
    } else {
      setError('Invalid owner credentials');
    }
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    const student = residents.find(r => r.id === studentId);
    if (student && studentPass === 'student123') {
      onLogin(student);
      toast.success(`Welcome, ${student.name}`);
    } else {
      setError('Invalid student credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center justify-center gap-3">
          <div className="bg-amber-500 p-2 rounded-lg">
            <Home className="text-slate-900 w-6 h-6" />
          </div>
          NEXUS HOSTEL
        </h1>
        <p className="text-slate-400 mt-2 tracking-widest text-xs uppercase font-semibold">Secure Management System</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-6 flex items-center gap-3 text-sm font-semibold max-w-4xl w-full">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Owner Card */}
        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 shadow-xl">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <LayoutDashboard className="text-amber-500 w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Owner Login</h2>
          </div>
          <form onSubmit={handleOwnerLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
              <input type="text" value={ownerUser} onChange={e => setOwnerUser(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-100 focus:border-amber-500 outline-none font-mono text-sm transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input type="password" value={ownerPass} onChange={e => setOwnerPass(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-100 focus:border-amber-500 outline-none font-mono text-sm transition-colors" />
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded transition-colors mt-2 uppercase tracking-wide text-sm">
              Access Admin Portal
            </button>
          </form>
        </div>

        {/* Student Card */}
        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 shadow-xl">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <User className="text-blue-500 w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Student Login</h2>
          </div>
          <form onSubmit={handleStudentLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Resident</label>
              <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-100 focus:border-amber-500 outline-none text-sm transition-colors">
                {residents.map(r => (
                  <option key={r.id} value={r.id}>{r.name} — Room {r.roomNo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input type="password" value={studentPass} onChange={e => setStudentPass(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-100 focus:border-amber-500 outline-none font-mono text-sm transition-colors" />
            </div>
            <button type="submit" className="w-full border border-slate-600 hover:border-slate-400 hover:bg-slate-700 text-slate-100 font-bold py-3 rounded transition-colors mt-2 uppercase tracking-wide text-sm">
              Enter Resident Area
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


// --- OWNER DASHBOARD ---
function OwnerDashboard({
  onLogout, rooms, setRooms, residents, setResidents,
  notices, setNotices, maintenance, setMaintenance,
  gatePasses, setGatePasses, roomRequests, setRoomRequests,
  visitors, setVisitors, messMenu, setMessMenu, inventory, setInventory
}) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'rooms', label: 'Rooms & Layout', icon: Home },
    { id: 'residents', label: 'Residents', icon: Users },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'requests', label: 'Passes & Requests', icon: Map },
    { id: 'visitors', label: 'Visitor Logs', icon: Shield },
    { id: 'mess', label: 'Mess & Inventory', icon: Coffee },
    { id: 'notices', label: 'Notice Board', icon: Bell },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-300 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex-col hidden lg:flex shrink-0">
        <div className="p-6 border-b border-slate-700 h-20 flex flex-col justify-center">
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded">
              <Home className="text-slate-900 w-4 h-4" />
            </div>
            NEXUS
          </h1>
          <p className="text-[10px] font-bold text-slate-500 mt-1.5 uppercase tracking-widest">Admin Portal</p>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-colors border-l-2 ${activeTab === tab.id ? 'bg-amber-500/10 text-amber-500 border-amber-500' : 'border-transparent hover:bg-slate-700/50 hover:text-slate-100'}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-700">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-red-400 transition-colors rounded hover:bg-red-500/10">
            <LogOut className="w-5 h-5" /> Logout Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 lg:hidden">
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Home className="text-amber-500 w-5 h-5" /> NEXUS
          </h1>
          <button onClick={onLogout} className="text-slate-400 hover:text-red-400">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Top Bar (Desktop) */}
        <div className="h-20 bg-slate-900 border-b border-slate-800 hidden lg:flex items-center px-8 shrink-0">
          <h2 className="text-xl font-bold text-slate-100 tracking-wide">{tabs.find(t => t.id === activeTab)?.label}</h2>
        </div>

        {/* Mobile Tab Scroller */}
        <div className="flex overflow-x-auto bg-slate-800 border-b border-slate-700 lg:hidden shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'text-amber-500 border-amber-500' : 'text-slate-400 border-transparent'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-900">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'overview' && <OwnerOverview rooms={rooms} residents={residents} maintenance={maintenance} gatePasses={gatePasses} />}
            {activeTab === 'rooms' && <OwnerRooms rooms={rooms} setRooms={setRooms} roomRequests={roomRequests} setRoomRequests={setRoomRequests} />}
            {activeTab === 'residents' && <OwnerResidents residents={residents} setResidents={setResidents} rooms={rooms} />}
            {activeTab === 'payments' && <OwnerPayments residents={residents} setResidents={setResidents} />}
            {activeTab === 'requests' && <OwnerRequests gatePasses={gatePasses} setGatePasses={setGatePasses} />}
            {activeTab === 'visitors' && <OwnerVisitors visitors={visitors} setVisitors={setVisitors} residents={residents} />}
            {activeTab === 'mess' && <OwnerMessAndInventory messMenu={messMenu} setMessMenu={setMessMenu} inventory={inventory} setInventory={setInventory} rooms={rooms} />}
            {activeTab === 'notices' && <OwnerNotices notices={notices} setNotices={setNotices} />}
            {activeTab === 'maintenance' && <OwnerMaintenance maintenance={maintenance} setMaintenance={setMaintenance} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- OWNER COMPONENTS ---
function OwnerOverview({ rooms, residents, maintenance, gatePasses }) {
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const vacantRooms = rooms.filter(r => r.status === 'Vacant').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  const pendingDues = residents.filter(r => r.paymentStatus === 'Pending').length;
  const monthlyRevenue = residents.filter(r => r.paymentStatus === 'Paid').reduce((acc, curr) => acc + (curr.paymentHistory[0]?.amount || 0), 0);

  const activePasses = gatePasses.filter(g => g.status === 'Approved').length;
  const pendingMaint = maintenance.filter(m => m.status === 'Pending').length;

  const kpis = [
    { label: 'Occupied %', value: `${occupancyRate}%`, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Vacant Rooms', value: vacantRooms, icon: Home, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'Total Residents', value: residents.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Monthly Revenue', value: `$${monthlyRevenue}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Pending Dues', value: pendingDues, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'Active Gate Passes', value: activePasses, icon: Map, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Pending Repairs', value: pendingMaint, icon: Wrench, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { label: 'Total Rooms', value: totalRooms, icon: LayoutDashboard, color: 'text-slate-400', bg: 'bg-slate-700/50', border: 'border-slate-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className={`bg-slate-800 p-5 rounded-lg border ${kpi.border} flex flex-col justify-between`}>
            <div className="flex items-start justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <div className="text-3xl font-mono text-slate-100">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-8 border-b border-slate-700 pb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" /> Revenue (Last 6 Months)
          </h3>
          <div className="flex items-end justify-between h-48 gap-3">
            {[45, 60, 55, 80, 75, 95].map((h, i) => {
              const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
              return (
                <div key={i} className="flex flex-col items-center flex-1 gap-3 group">
                  <div className="w-full max-w-[2.5rem] bg-amber-500/80 group-hover:bg-amber-500 rounded-t transition-colors relative" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-xs font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 border border-slate-700 pointer-events-none">
                      ${h * 120}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{months[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floor Occupancy Ring/Bars */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-8 border-b border-slate-700 pb-3 flex items-center gap-2">
            <Home className="w-4 h-4 text-amber-500" /> Floor Occupancy
          </h3>
          <div className="space-y-6 mt-4">
            {[1, 2, 3].map(floor => {
              const floorRooms = rooms.filter(r => r.floor === floor);
              const floorOccupied = floorRooms.filter(r => r.status === 'Occupied').length;
              const pct = Math.round((floorOccupied / floorRooms.length) * 100);
              return (
                <div key={floor}>
                  <div className="flex justify-between text-xs mb-2 font-bold uppercase tracking-wider">
                    <span className="text-slate-300">Floor {floor}</span>
                    <span className="font-mono text-amber-500">{pct}% Occupied</span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnerRooms({ rooms, setRooms, roomRequests, setRoomRequests }) {
  const [filterFloor, setFilterFloor] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredRooms = rooms.filter(r => {
    if (filterFloor !== 'All' && r.floor.toString() !== filterFloor) return false;
    if (filterType !== 'All' && r.type !== filterType) return false;
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    return true;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Occupied': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' };
      case 'Vacant': return { bg: 'bg-slate-700/30', text: 'text-slate-300', border: 'border-slate-600' };
      case 'Maintenance': return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' };
      default: return { bg: '', text: '', border: '' };
    }
  };

  const cycleStatus = (id, currentStatus) => {
    const statuses = ['Vacant', 'Occupied', 'Maintenance'];
    const next = statuses[(statuses.indexOf(currentStatus) + 1) % 3];
    setRooms(rooms.map(r => r.id === id ? { ...r, status: next } : r));
    toast.success(`Room status updated to ${next}`);
  };

  const handleRoomRequest = (id, newStatus) => {
    setRoomRequests(roomRequests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Room change request ${newStatus.toLowerCase()}`);
  };

  return (
    <div className="space-y-8">
      {/* Pending Room Requests */}
      {roomRequests.some(r => r.status === 'Pending') && (
        <div className="bg-slate-800 p-6 rounded-lg border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Pending Room Change Requests
          </h3>
          <div className="space-y-3">
            {roomRequests.filter(r => r.status === 'Pending').map(req => (
              <div key={req.id} className="bg-slate-900 border border-slate-700 p-4 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-slate-200 font-bold">{req.studentName} <span className="text-slate-500 font-mono text-xs ml-2">Current: {req.currentRoom}</span></div>
                  <div className="text-sm text-slate-400 mt-1">Requests change to <span className="text-amber-500 font-bold">{req.requestedType}</span> — "{req.reason}"</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleRoomRequest(req.id, 'Approved')} className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-500/20">Approve</button>
                  <button onClick={() => handleRoomRequest(req.id, 'Rejected')} className="bg-red-500/10 text-red-500 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/20">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-800 rounded-lg border border-slate-700">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Filter Floor</label>
          <select value={filterFloor} onChange={e => setFilterFloor(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 focus:border-amber-500 outline-none">
            <option value="All">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Filter Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 focus:border-amber-500 outline-none">
            <option value="All">All Types</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Triple">Triple</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Filter Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 focus:border-amber-500 outline-none">
            <option value="All">All Statuses</option>
            <option value="Occupied">Occupied</option>
            <option value="Vacant">Vacant</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredRooms.map(room => {
          const styles = getStatusStyle(room.status);
          return (
            <div key={room.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col hover:border-amber-500/50 transition-colors">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span className="text-2xl font-mono text-slate-100 font-bold">{room.roomNo}</span>
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1">{room.type}</p>
                </div>
                <button
                  onClick={() => cycleStatus(room.id, room.status)}
                  className={`text-[10px] px-2 py-1 rounded border uppercase font-bold tracking-wider ${styles.bg} ${styles.text} ${styles.border} hover:opacity-75 transition-opacity`}
                  title="Click to change status"
                >
                  {room.status}
                </button>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-700/50">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Occupants</span>
                  <span className="font-mono">{room.occupants.length}/{room.capacity}</span>
                </div>
                <div className="min-h-[2.5rem] space-y-1">
                  {room.occupants.map((occ, i) => (
                    <div key={i} className="text-sm text-slate-300 truncate font-medium flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-500" /> {occ}
                    </div>
                  ))}
                  {room.occupants.length === 0 && <div className="text-xs text-slate-500 italic">Empty</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OwnerResidents({ residents, setResidents, rooms }) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newRoom, setNewRoom] = useState('');

  const filtered = residents.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.roomNo.includes(search) ||
    r.paymentStatus.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName || !newRoom) return;
    const newResident = {
      id: `S${Date.now()}`,
      name: newName,
      roomNo: newRoom,
      moveInDate: new Date().toISOString().split('T')[0],
      contact: newContact || '555-0000',
      guardianName: 'Unassigned',
      guardianContact: '555-0000',
      course: 'Unassigned',
      bloodGroup: 'Unknown',
      password: 'student123',
      paymentStatus: 'Pending',
      paymentHistory: []
    };
    setResidents([newResident, ...residents]);
    setShowAdd(false);
    setNewName('');
    setNewContact('');
    setNewRoom('');
    toast.success('Resident added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800 p-5 rounded-lg border border-slate-700">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search name, room, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:border-amber-500 outline-none font-sans"
          />
        </div>
        <button onClick={() => setShowAdd(true)} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-900 px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add Resident
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-700">
            <tr>
              <th className="p-4">Resident Name</th>
              <th className="p-4">Room</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Move In Date</th>
              <th className="p-4">Payment Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="p-4 text-slate-200 font-semibold">{r.name}</td>
                <td className="p-4 font-mono text-amber-500">{r.roomNo}</td>
                <td className="p-4 font-mono text-slate-400">{r.contact}</td>
                <td className="p-4 font-mono text-slate-400">{r.moveInDate}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${r.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                    r.paymentStatus === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                      'bg-red-500/10 text-red-500 border-red-500/30'
                    }`}>
                    {r.paymentStatus}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setViewStudent(r)} className="border border-slate-600 hover:border-amber-500 text-slate-300 hover:text-amber-500 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors">Details</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-slate-500 italic">No residents found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <User className="text-amber-500 w-5 h-5" /> New Resident
              </h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-amber-500 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Number</label>
                <input required type="text" value={newContact} onChange={e => setNewContact(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 font-mono outline-none focus:border-amber-500 transition-colors" placeholder="555-0000" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assign Room</label>
                <select required value={newRoom} onChange={e => setNewRoom(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-amber-500 font-mono">
                  <option value="">-- Select Available Room --</option>
                  {rooms.filter(r => r.occupants.length < r.capacity && r.status !== 'Maintenance').map(r => (
                    <option key={r.id} value={r.roomNo}>{r.roomNo} ({r.type}) — {r.capacity - r.occupants.length} bed(s) available</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-2.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewStudent && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 md:p-8 relative">
              <button onClick={() => setViewStudent(null)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-300 bg-slate-900/50 p-1.5 rounded-full z-20"><X className="w-5 h-5" /></button>
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-amber-500/20 to-transparent pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 mb-8 mt-4">
                <div className="w-24 h-24 shrink-0 bg-slate-900 border-4 border-amber-500 rounded-full flex items-center justify-center text-amber-500 text-3xl font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  {viewStudent.name.charAt(0)}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-slate-100">{viewStudent.name}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                    <span className="text-amber-500 font-mono text-[10px] uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">ID: {viewStudent.id}</span>
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border ${viewStudent.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      viewStudent.paymentStatus === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>Status: {viewStudent.paymentStatus}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 divide-y divide-slate-700/50 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="p-3"><span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Phone className="w-3 h-3" /> Contact</span><span className="text-slate-200 font-mono text-sm">{viewStudent.contact}</span></div>
                  <div className="p-3"><span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Home className="w-3 h-3" /> Room</span><span className="text-slate-200 font-mono text-sm">{viewStudent.roomNo}</span></div>
                  <div className="p-3"><span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Move-in Date</span><span className="text-slate-200 font-mono text-sm">{viewStudent.moveInDate}</span></div>
                </div>
                <div className="space-y-1 divide-y divide-slate-700/50 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="p-3"><span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Users className="w-3 h-3" /> Guardian</span><span className="text-slate-200 text-sm">{viewStudent.guardianName || 'N/A'}</span></div>
                  <div className="p-3"><span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Phone className="w-3 h-3" /> Guardian Contact</span><span className="text-slate-200 font-mono text-sm">{viewStudent.guardianContact || 'N/A'}</span></div>
                  <div className="p-3"><span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> Course</span><span className="text-slate-200 text-sm">{viewStudent.course || 'N/A'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OwnerPayments({ residents, setResidents }) {
  const markAsPaid = (residentId) => {
    setResidents(residents.map(r => {
      if (r.id === residentId) {
        const history = [...r.paymentHistory];
        if (history.length > 0) {
          history[0] = {
            ...history[0],
            status: 'Paid',
            paid: new Date().toISOString().split('T')[0],
            receiptNo: `REC-${Date.now()}`
          };
        }
        return { ...r, paymentStatus: 'Paid', paymentHistory: history };
      }
      return r;
    }));
    toast.success('Payment recorded & invoice generated!');
  };

  const totalCollected = residents.filter(r => r.paymentStatus === 'Paid').reduce((acc, curr) => acc + (curr.paymentHistory[0]?.amount || 0), 0);
  const totalPending = residents.filter(r => r.paymentStatus !== 'Paid').reduce((acc, curr) => acc + (curr.paymentHistory[0]?.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Collected</p>
            <p className="text-4xl font-mono text-emerald-400">${totalCollected}</p>
          </div>
          <CheckCircle className="w-16 h-16 text-emerald-500/10 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</p>
            <p className="text-4xl font-mono text-amber-500">${totalPending}</p>
          </div>
          <Clock className="w-16 h-16 text-amber-500/10 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-700">
            <tr>
              <th className="p-4">Resident</th>
              <th className="p-4">Room</th>
              <th className="p-4">Amount Due</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {residents.map(r => {
              const payment = r.paymentHistory[0];
              if (!payment) return null;
              return (
                <tr key={r.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 text-slate-200 font-semibold">{r.name}</td>
                  <td className="p-4 font-mono text-slate-400">{r.roomNo}</td>
                  <td className="p-4 font-mono text-slate-200">${payment.amount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${r.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                      r.paymentStatus === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                        'bg-red-500/10 text-red-500 border-red-500/30'
                      }`}>
                      {r.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {r.paymentStatus !== 'Paid' ? (
                      <button
                        onClick={() => markAsPaid(r.id)}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Mark as Paid
                      </button>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-slate-500 font-mono text-[10px]">Paid on {payment.paid}</span>
                        <span className="text-emerald-500/70 font-mono text-[10px]">{payment.receiptNo}</span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OwnerRequests({ gatePasses, setGatePasses }) {
  const handleAction = (id, newStatus) => {
    setGatePasses(gatePasses.map(g => g.id === id ? { ...g, status: newStatus } : g));
    toast.success(`Gate pass ${newStatus.toLowerCase()}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-700 pb-3">
          <Map className="w-5 h-5 text-amber-500" /> Gate Pass Requests
        </h3>

        <div className="space-y-4">
          {gatePasses.length === 0 ? (
            <div className="text-center p-8 text-slate-500 font-mono text-sm">No gate pass requests.</div>
          ) : (
            gatePasses.map(g => (
              <div key={g.id} className="bg-slate-900 border border-slate-700 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-slate-200 font-bold">{g.studentName}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${g.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                      g.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                        'bg-red-500/10 text-red-500 border-red-500/30'
                      }`}>{g.status}</span>
                  </div>
                  <div className="text-sm text-slate-400 font-mono">
                    {g.fromDate} <ArrowRight className="inline w-3 h-3 mx-1" /> {g.toDate}
                  </div>
                  <p className="text-slate-300 text-sm mt-2">{g.reason}</p>
                </div>
                {g.status === 'Pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleAction(g.id, 'Approved')} className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-colors">Approve</button>
                    <button onClick={() => handleAction(g.id, 'Rejected')} className="bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors">Reject</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function OwnerVisitors({ visitors, setVisitors, residents }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ visitorName: '', studentId: '', relation: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    const student = residents.find(r => r.id === form.studentId);
    if (!student) return;

    const newVisitor = {
      id: Date.now(),
      visitorName: form.visitorName,
      studentId: student.id,
      studentName: student.name,
      date: new Date().toISOString().split('T')[0],
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeOut: null,
      relation: form.relation
    };
    setVisitors([newVisitor, ...visitors]);
    setShowAdd(false);
    setForm({ visitorName: '', studentId: '', relation: '' });
    toast.success('Visitor logged successfully');
  };

  const handleCheckout = (id) => {
    setVisitors(visitors.map(v => v.id === id ? { ...v, timeOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : v));
    toast.success('Visitor checked out');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-800 p-5 rounded-lg border border-slate-700">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" /> Visitor Register
        </h3>
        <button onClick={() => setShowAdd(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Log Visitor
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-700">
            <tr>
              <th className="p-4">Visitor Details</th>
              <th className="p-4">Visiting</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time In</th>
              <th className="p-4">Time Out</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {visitors.map(v => (
              <tr key={v.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="p-4">
                  <div className="text-slate-200 font-semibold">{v.visitorName}</div>
                  <div className="text-slate-500 text-[10px] uppercase mt-1">{v.relation}</div>
                </td>
                <td className="p-4 text-slate-300 font-medium">{v.studentName}</td>
                <td className="p-4 font-mono text-slate-400">{v.date}</td>
                <td className="p-4 font-mono text-emerald-500">{v.timeIn}</td>
                <td className="p-4 font-mono text-slate-400">{v.timeOut || '--:--'}</td>
                <td className="p-4 text-right">
                  {!v.timeOut ? (
                    <button onClick={() => handleCheckout(v.id)} className="border border-amber-500 text-amber-500 hover:bg-amber-500/10 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors">
                      Check Out
                    </button>
                  ) : (
                    <span className="text-slate-500 font-mono text-xs"><Check className="w-4 h-4 inline text-emerald-500" /></span>
                  )}
                </td>
              </tr>
            ))}
            {visitors.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-slate-500 italic">No visitors logged.</td></tr>}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Shield className="text-amber-500 w-5 h-5" /> Log Visitor Entry
              </h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Visitor Name</label>
                <input required type="text" value={form.visitorName} onChange={e => setForm({ ...form, visitorName: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Relation</label>
                <input required type="text" value={form.relation} onChange={e => setForm({ ...form, relation: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-amber-500" placeholder="e.g. Father, Friend" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Visiting Student</label>
                <select required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-amber-500 font-mono">
                  <option value="">-- Select Student --</option>
                  {residents.map(r => (
                    <option key={r.id} value={r.id}>{r.name} (Room {r.roomNo})</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-2.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors">Grant Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function OwnerMessAndInventory({ messMenu, setMessMenu, inventory, setInventory, rooms }) {
  const [subTab, setSubTab] = useState('mess');
  const [roomFilter, setRoomFilter] = useState('All');

  const filteredInventory = inventory.filter(i => roomFilter === 'All' || i.roomNo === roomFilter);

  const handleConditionChange = (id, newCondition) => {
    setInventory(inventory.map(i => i.id === id ? { ...i, condition: newCondition } : i));
    toast.success(`Inventory updated`);
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex gap-4 border-b border-slate-700">
        <button onClick={() => setSubTab('mess')} className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${subTab === 'mess' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          Mess Menu
        </button>
        <button onClick={() => setSubTab('inventory')} className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${subTab === 'inventory' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          Room Inventory
        </button>
      </div>

      {subTab === 'mess' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {messMenu.map(menu => (
            <div key={menu.id} className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <h4 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4 border-b border-slate-700 pb-2 flex items-center justify-between">
                {menu.day} <Coffee className="w-4 h-4" />
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Breakfast</span>
                  <p className="text-slate-200 text-sm font-medium">{menu.breakfast}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Lunch</span>
                  <p className="text-slate-200 text-sm font-medium">{menu.lunch}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Dinner</span>
                  <p className="text-slate-200 text-sm font-medium">{menu.dinner}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {subTab === 'inventory' && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
            <h4 className="text-slate-300 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <Box className="w-4 h-4 text-amber-500" /> Asset Tracking
            </h4>
            <select value={roomFilter} onChange={e => setRoomFilter(e.target.value)} className="bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-slate-200 outline-none font-mono">
              <option value="All">All Rooms</option>
              {rooms.map(r => <option key={r.id} value={r.roomNo}>{r.roomNo}</option>)}
            </select>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="p-4">Room No</th>
                  <th className="p-4">Asset / Item</th>
                  <th className="p-4">Condition</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredInventory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-mono text-amber-500">{item.roomNo}</td>
                    <td className="p-4 text-slate-200 font-medium">{item.item}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${item.condition === 'Good' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                        'bg-red-500/10 text-red-500 border-red-500/30'
                        }`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {item.condition === 'Good' ? (
                        <button onClick={() => handleConditionChange(item.id, 'Damaged')} className="border border-red-500/50 text-red-500 hover:bg-red-500/10 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors">Mark Damaged</button>
                      ) : (
                        <button onClick={() => handleConditionChange(item.id, 'Good')} className="border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors">Mark Fixed</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function OwnerNotices({ notices, setNotices }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', category: '📢 General', priority: 'Normal' });

  const handlePost = (e) => {
    e.preventDefault();
    const newNotice = {
      id: Date.now(),
      ...form,
      date: new Date().toISOString(),
      postedBy: 'Management'
    };
    setNotices([newNotice, ...notices]);
    setShowAdd(false);
    setForm({ title: '', message: '', category: '📢 General', priority: 'Normal' });
    toast.success('Notice published');
  };

  const deleteNotice = (id) => {
    setNotices(notices.filter(n => n.id !== id));
    toast.error('Notice deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-800 p-5 rounded-lg border border-slate-700">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Notice Board</h3>
        <button onClick={() => setShowAdd(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Post Notice
        </button>
      </div>

      <div className="grid gap-4">
        {notices.map(notice => (
          <div key={notice.id} className={`bg-slate-800 p-6 rounded-lg border relative transition-all ${notice.priority === 'Urgent' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-700 hover:border-slate-600'}`}>
            {notice.priority === 'Urgent' && (
              <span className="absolute top-0 left-0 w-1.5 h-full bg-red-500 rounded-l-lg"></span>
            )}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-900 px-2.5 py-1 rounded text-slate-300 border border-slate-700">{notice.category}</span>
                {notice.priority === 'Urgent' && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    URGENT
                  </span>
                )}
              </div>
              <button onClick={() => deleteNotice(notice.id)} className="text-slate-500 hover:text-red-400 bg-slate-900/50 p-1 rounded transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2 mt-4">{notice.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{notice.message}</p>
            <div className="mt-5 pt-4 border-t border-slate-700/50 flex justify-between text-[11px] text-slate-500 font-mono uppercase tracking-wider">
              <span>{new Date(notice.date).toLocaleString()}</span>
              <span>Posted By: {notice.postedBy}</span>
            </div>
          </div>
        ))}
        {notices.length === 0 && (
          <div className="text-center p-8 bg-slate-800 border border-slate-700 rounded-lg text-slate-500 font-mono text-sm">
            No active notices.
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Bell className="text-amber-500 w-5 h-5" /> Post Notice
              </h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handlePost} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notice Title</label>
                <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-amber-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-amber-500">
                    <option>📢 General</option>
                    <option>⚡ Electricity</option>
                    <option>🔧 Maintenance</option>
                    <option>🚨 Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-amber-500">
                    <option>Normal</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Message Body</label>
                <textarea required rows="4" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-amber-500 resize-none"></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-2.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors">Publish Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function OwnerMaintenance({ maintenance, setMaintenance }) {
  const [updateModal, setUpdateModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const openUpdate = (m) => {
    setUpdateModal(m);
    setNewStatus(m.status);
  };

  const saveUpdate = (e) => {
    e.preventDefault();
    setMaintenance(maintenance.map(m => m.id === updateModal.id ? { ...m, status: newStatus } : m));
    setUpdateModal(null);
    toast.success('Maintenance ticket updated');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'In Progress': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      default: return 'bg-red-500/10 text-red-500 border-red-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-700">
            <tr>
              <th className="p-4">Resident / Room</th>
              <th className="p-4">Issue Description</th>
              <th className="p-4">Date Submitted</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {maintenance.map(m => (
              <tr key={m.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="p-4">
                  <div className="text-slate-200 font-semibold">{m.studentName}</div>
                  <div className="text-slate-500 font-mono text-[10px] uppercase mt-1">Room {m.roomNo}</div>
                </td>
                <td className="p-4 max-w-xs whitespace-normal">
                  <div className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-1">{m.category}</div>
                  <div className="text-slate-300 text-sm leading-snug">{m.description}</div>
                </td>
                <td className="p-4 font-mono text-slate-400 text-xs">{m.date}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 font-bold uppercase tracking-wider rounded text-[10px] border ${getStatusColor(m.status)}`}>
                    {m.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => openUpdate(m)}
                    className="border border-slate-600 hover:border-amber-500 text-slate-300 hover:text-amber-500 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
            {maintenance.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500 italic">No maintenance requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {updateModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Wrench className="text-amber-500 w-5 h-5" /> Update Request
              </h3>
              <button onClick={() => setUpdateModal(null)} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
            </div>

            <div className="mb-6 bg-slate-900 p-4 rounded border border-slate-700">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Issue Details</div>
              <div className="text-sm text-slate-200"><span className="text-amber-500 font-bold">{updateModal.category}</span> issue in Room <span className="font-mono">{updateModal.roomNo}</span></div>
            </div>
            <form onSubmit={saveUpdate} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">New Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-amber-500">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-2.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors">Save Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// --- STUDENT DASHBOARD ---
function StudentDashboard({
  student, onLogout, rooms, notices, maintenance, setMaintenance,
  gatePasses, setGatePasses, roomRequests, setRoomRequests, messMenu, inventory
}) {
  const [activeTab, setActiveTab] = useState('room');

  const roomInfo = rooms.find(r => r.roomNo === student.roomNo);
  const myMaintenance = maintenance.filter(m => m.studentId === student.id);
  const myGatePasses = gatePasses.filter(g => g.studentId === student.id);
  const myInventory = inventory.filter(i => i.roomNo === student.roomNo);

  const navs = [
    { id: 'room', label: 'My Room', icon: Home },
    { id: 'mess', label: 'Mess Menu', icon: Coffee },
    { id: 'gatepass', label: 'Gate Pass', icon: Map },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col text-slate-300 font-sans">
      {/* Top Navbar */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center text-slate-900 font-bold text-lg">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold text-slate-100 leading-tight">{student.name}</h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest mt-0.5">ROOM {student.roomNo}</p>
          </div>
        </div>
        <button onClick={onLogout} className="text-slate-400 hover:text-red-400 p-2 transition-colors bg-slate-900/50 rounded border border-slate-700 hover:border-red-500/50">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto bg-slate-800 border-b border-slate-700 px-4 md:px-8 shrink-0">
        {navs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'text-amber-500 border-amber-500' : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-700/30'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 max-w-4xl w-full mx-auto overflow-y-auto">
        {activeTab === 'room' && <StudentRoom room={roomInfo} student={student} roomRequests={roomRequests} setRoomRequests={setRoomRequests} inventory={myInventory} />}
        {activeTab === 'mess' && <StudentMess messMenu={messMenu} />}
        {activeTab === 'gatepass' && <StudentGatePass student={student} gatePasses={myGatePasses} setGatePasses={setGatePasses} allGatePasses={gatePasses} />}
        {activeTab === 'payments' && <StudentPayments student={student} />}
        {activeTab === 'notices' && <StudentNotices notices={notices} />}
        {activeTab === 'maintenance' && <StudentMaintenance maintenance={myMaintenance} setMaintenance={setMaintenance} student={student} />}
        {activeTab === 'profile' && <StudentProfile student={student} />}
      </div>
    </div>
  );
}

// --- STUDENT COMPONENTS ---
function StudentRoom({ room, student, roomRequests, setRoomRequests, inventory }) {
  const [showReq, setShowReq] = useState(false);
  const [reqType, setReqType] = useState('Single');
  const [reason, setReason] = useState('');

  const myReq = roomRequests.find(r => r.studentId === student.id && r.status === 'Pending');

  if (!room) return <div className="text-center p-8 text-slate-500 font-mono">Room details unavailable.</div>;

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    const newReq = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      currentRoom: room.roomNo,
      requestedType: reqType,
      reason,
      status: 'Pending'
    };
    setRoomRequests([newReq, ...roomRequests]);
    setShowReq(false);
    toast.success('Room change request submitted');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 py-12 relative overflow-hidden">
        <Home className="w-48 h-48 text-slate-700/20 absolute -right-10 -bottom-10 pointer-events-none" />
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-6xl font-mono text-slate-100 mb-4">{room.roomNo}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs font-bold uppercase tracking-widest">
            <span className="bg-slate-900 text-amber-500 px-4 py-1.5 rounded border border-slate-700">{room.type} Room</span>
            <span className="bg-slate-900 text-slate-300 px-4 py-1.5 rounded border border-slate-700">Floor {room.floor}</span>
          </div>
        </div>
        <div className="relative z-10 shrink-0">
          {!myReq ? (
            <button onClick={() => setShowReq(true)} className="bg-slate-900 hover:bg-amber-500 text-amber-500 hover:text-slate-900 border border-amber-500/50 px-6 py-3 rounded font-bold text-xs uppercase tracking-wider transition-colors shadow-lg">
              Request Room Change
            </button>
          ) : (
            <div className="bg-slate-900 border border-amber-500/50 p-4 rounded text-center">
              <span className="block text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">Pending Request</span>
              <span className="text-slate-300 text-sm font-mono">Waiting for {myReq.requestedType}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-700 pb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" /> Current Roommates
          </h3>
          <ul className="space-y-4">
            {room.occupants.map((occ, i) => (
              <li key={i} className={`flex items-center gap-4 p-4 rounded border ${occ === student.name ? 'bg-amber-500/5 border-amber-500/20 text-amber-500' : 'bg-slate-900 border-slate-700/50 text-slate-200'}`}>
                <div className={`p-2 rounded ${occ === student.name ? 'bg-amber-500/20' : 'bg-slate-800'}`}>
                  <User className="w-5 h-5" />
                </div>
                <span className="font-semibold">{occ} {occ === student.name && '(You)'}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-700 pb-3 flex items-center gap-2">
            <Box className="w-4 h-4 text-amber-500" /> Room Inventory Details
          </h3>
          <ul className="space-y-3">
            {inventory.map(item => (
              <li key={item.id} className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-700/50">
                <span className="text-sm font-medium text-slate-200">{item.item}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${item.condition === 'Good' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'
                  }`}>
                  {item.condition}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showReq && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Home className="text-amber-500 w-5 h-5" /> Request Room Change
              </h3>
              <button onClick={() => setShowReq(false)} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmitRequest} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Requested Room Type</label>
                <select value={reqType} onChange={e => setReqType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-amber-500 font-sans">
                  {['Single', 'Double', 'Triple'].filter(t => t !== room.type).map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reason for Change</label>
                <textarea required rows="4" value={reason} onChange={e => setReason(e.target.value)} placeholder="Provide a valid reason..." className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm text-slate-200 outline-none focus:border-amber-500 resize-none font-sans"></textarea>
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded transition-colors text-xs uppercase tracking-wider">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentMess({ messMenu }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 md:p-8 rounded-lg border border-slate-700 shadow-lg text-center relative overflow-hidden">
        <Coffee className="w-32 h-32 text-slate-700/20 absolute -left-10 -bottom-10 pointer-events-none" />
        <h2 className="text-xl md:text-2xl font-bold text-slate-100 uppercase tracking-widest mb-2 relative z-10">Weekly Mess Menu</h2>
        <p className="text-sm text-slate-400 relative z-10">Check today's specials and plan your meals.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {messMenu.map(menu => {
          const isToday = menu.day === today;
          return (
            <div key={menu.id} className={`bg-slate-800 p-6 rounded-lg border transition-all ${isToday ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)] relative scale-[1.02]' : 'border-slate-700'
              }`}>
              {isToday && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Today</span>}
              <h3 className={`text-lg font-bold uppercase tracking-widest mb-4 border-b pb-3 flex items-center justify-between ${isToday ? 'text-amber-500 border-amber-500/30' : 'text-slate-100 border-slate-700'}`}>
                {menu.day} <ClipboardList className="w-4 h-4 opacity-50" />
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Breakfast (7:30 AM - 9:30 AM)</span>
                  <p className="text-slate-200 text-sm font-medium">{menu.breakfast}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Lunch (12:30 PM - 2:30 PM)</span>
                  <p className="text-slate-200 text-sm font-medium">{menu.lunch}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Dinner (7:30 PM - 9:30 PM)</span>
                  <p className="text-slate-200 text-sm font-medium">{menu.dinner}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudentGatePass({ student, gatePasses, setGatePasses, allGatePasses }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason) return;
    const newPass = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      fromDate,
      toDate,
      reason,
      status: 'Pending'
    };
    setGatePasses([newPass, ...allGatePasses]);
    setFromDate('');
    setToDate('');
    setReason('');
    toast.success('Gate pass requested successfully');
  };

  return (
    <div className="space-y-10">
      {/* Form */}
      <div className="bg-slate-800 p-6 md:p-8 rounded-lg border border-slate-700 shadow-lg">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-700 pb-3">
          <Map className="w-5 h-5 text-amber-500" /> Apply For Gate Pass
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">From Date</label>
              <input required type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm text-slate-200 outline-none focus:border-amber-500 font-mono" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">To Date</label>
              <input required type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm text-slate-200 outline-none focus:border-amber-500 font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reason for Leave</label>
            <textarea required rows="3" value={reason} onChange={e => setReason(e.target.value)} placeholder="Provide accurate details..." className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm text-slate-200 outline-none focus:border-amber-500 resize-none font-sans"></textarea>
          </div>
          <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded transition-colors text-xs uppercase tracking-wider w-full sm:w-auto">
            Submit Request
          </button>
        </form>
      </div>

      {/* History */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-500" /> Pass History
        </h3>
        <div className="space-y-4">
          {gatePasses.length === 0 ? (
            <div className="text-center p-8 bg-slate-800 border border-slate-700 rounded-lg text-slate-500 font-mono text-sm">
              No gate pass history.
            </div>
          ) : (
            gatePasses.map(g => (
              <div key={g.id} className="bg-slate-800 p-5 rounded-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${g.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                      g.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                        'bg-red-500/10 text-red-500 border-red-500/30'
                      }`}>{g.status}</span>
                    <span className="text-sm font-mono text-slate-400">{g.fromDate} to {g.toDate}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mt-2">{g.reason}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StudentPayments({ student }) {
  const isOverdue = student.paymentStatus === 'Overdue';
  const isPending = student.paymentStatus === 'Pending';
  const amount = student.paymentHistory[0]?.amount || 0;

  const handleDownload = (receiptNo) => {
    toast.success(`Downloading ${receiptNo}.pdf...`);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className={`p-8 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-6 ${isOverdue ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' :
        isPending ? 'bg-amber-500/10 border-amber-500/50' :
          'bg-emerald-500/10 border-emerald-500/50'
        }`}>
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isOverdue ? 'text-red-500' : isPending ? 'text-amber-500' : 'text-emerald-500'
            }`}>Current Balance</p>
          <h2 className="text-5xl font-mono text-slate-100">${isOverdue || isPending ? amount : '0.00'}</h2>
        </div>
        <div>
          <span className={`px-6 py-2.5 rounded font-bold uppercase tracking-widest text-sm border ${isOverdue ? 'bg-red-500/20 text-red-500 border-red-500/50' :
            isPending ? 'bg-amber-500/20 text-amber-500 border-amber-500/50' :
              'bg-emerald-500/20 text-emerald-500 border-emerald-500/50'
            }`}>
            Status: {student.paymentStatus}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-500" /> Payment History
        </h3>
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-700">
              <tr>
                <th className="p-4">Billing Month</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {student.paymentHistory.map((p, i) => (
                <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 text-slate-200 font-semibold">{p.month}</td>
                  <td className="p-4 font-mono text-slate-300">${p.amount}</td>
                  <td className="p-4 font-mono text-slate-500">{p.due}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                      p.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                        'bg-red-500/10 text-red-500 border-red-500/30'
                      }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {p.status === 'Paid' ? (
                      <button
                        onClick={() => handleDownload(p.receiptNo)}
                        className="bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-500 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                      >
                        <FileDown className="w-3 h-3" /> Download
                      </button>
                    ) : (
                      <span className="text-slate-600 font-mono text-xs">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentNotices({ notices }) {
  const sorted = [...notices].sort((a, b) => {
    if (a.priority === 'Urgent' && b.priority !== 'Urgent') return -1;
    if (a.priority !== 'Urgent' && b.priority === 'Urgent') return 1;
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="grid gap-5">
      {sorted.map(notice => (
        <div key={notice.id} className={`bg-slate-800 p-6 md:p-8 rounded-lg border relative transition-all ${notice.priority === 'Urgent' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-700'}`}>
          {notice.priority === 'Urgent' && (
            <span className="absolute top-0 left-0 w-1.5 h-full bg-red-500 rounded-l-lg"></span>
          )}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-900 px-3 py-1.5 rounded text-slate-300 border border-slate-700">{notice.category}</span>
            {notice.priority === 'Urgent' && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                URGENT
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-3">{notice.title}</h3>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6">{notice.message}</p>
          <div className="pt-4 border-t border-slate-700/50 flex justify-between text-[11px] text-slate-500 font-mono uppercase tracking-wider">
            <span>{new Date(notice.date).toLocaleString()}</span>
            <span>By: Management</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function StudentMaintenance({ maintenance, setMaintenance, student }) {
  const [cat, setCat] = useState('Plumbing');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc.trim()) return;
    const newReq = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      roomNo: student.roomNo,
      category: cat,
      description: desc,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setMaintenance([newReq, ...maintenance]);
    setDesc('');
    toast.success('Maintenance ticket submitted');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'In Progress': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default: return 'text-red-500 bg-red-500/10 border-red-500/30';
    }
  };

  return (
    <div className="space-y-10">
      {/* Form */}
      <div className="bg-slate-800 p-6 md:p-8 rounded-lg border border-slate-700 shadow-lg">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-700 pb-3">
          <Wrench className="w-5 h-5 text-amber-500" /> File Maintenance Request
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Issue Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm text-slate-200 outline-none focus:border-amber-500 font-sans">
              <option>Plumbing</option>
              <option>Electrical</option>
              <option>Carpentry</option>
              <option>Cleaning</option>
              <option>Internet / WiFi</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
            <textarea required rows="4" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the issue in detail..." className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm text-slate-200 outline-none focus:border-amber-500 resize-none font-sans"></textarea>
          </div>
          <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded transition-colors text-xs uppercase tracking-wider w-full sm:w-auto">
            Submit Request
          </button>
        </form>
      </div>

      {/* History */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-500" /> Request History
        </h3>
        <div className="space-y-4">
          {maintenance.length === 0 ? (
            <div className="text-center p-8 bg-slate-800 border border-slate-700 rounded-lg text-slate-500 font-mono text-sm">
              No previous maintenance requests.
            </div>
          ) : (
            maintenance.map(m => (
              <div key={m.id} className="bg-slate-800 p-5 rounded-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{m.category}</span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">| &nbsp; {m.date}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{m.description}</p>
                </div>
                <div className="shrink-0">
                  <span className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(m.status)}`}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StudentProfile({ student }) {
  return (
    <div className="bg-slate-800 p-8 md:p-10 rounded-lg border border-slate-700 max-w-xl mx-auto mt-4 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-amber-500/20 to-transparent pointer-events-none"></div>

      <div className="flex flex-col items-center mb-10 relative z-10">
        <div className="w-28 h-28 bg-slate-900 border-4 border-amber-500 rounded-full flex items-center justify-center text-amber-500 text-4xl font-bold mb-5 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          {student.name.charAt(0)}
        </div>
        <h2 className="text-3xl font-bold text-slate-100">{student.name}</h2>
        <p className="text-amber-500 font-mono text-xs uppercase tracking-widest mt-2 bg-amber-500/10 px-3 py-1 rounded">Student ID: {student.id}</p>
      </div>

      <div className="space-y-1 divide-y divide-slate-700/50 bg-slate-900 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" /> Contact Info</span>
          <span className="text-slate-200 font-mono text-sm">{student.contact}</span>
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><BookOpen className="w-4 h-4 text-slate-500" /> Course</span>
          <span className="text-slate-200 font-mono text-sm">{student.course || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Heart className="w-4 h-4 text-slate-500" /> Blood Group</span>
          <span className="text-slate-200 font-mono text-sm">{student.bloodGroup || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4 text-slate-500" /> Guardian Info</span>
          <div className="text-right">
            <div className="text-slate-200 text-sm font-semibold">{student.guardianName || 'N/A'}</div>
            <div className="text-slate-400 font-mono text-xs">{student.guardianContact || 'N/A'}</div>
          </div>
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Home className="w-4 h-4 text-slate-500" /> Room Allocation</span>
          <span className="text-slate-200 font-mono text-sm">{student.roomNo}</span>
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-500" /> Move-in Date</span>
          <span className="text-slate-200 font-mono text-sm">{student.moveInDate}</span>
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Info className="w-4 h-4 text-slate-500" /> Account Status</span>
          <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded">Active</span>
        </div>
      </div>
    </div>
  );
}
