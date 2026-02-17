import React, { useState, useEffect } from 'react';
import { studyRoomApi } from '../../api/studyRoom.api';
import { useAuth } from '../../context/AuthContext';
import {
    Users, Plus, ArrowRight, Clock, Loader2, Video, X, Key, Copy, Check, LogIn, Crown, Trash2, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const StudyRooms = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showMeetingDetails, setShowMeetingDetails] = useState(null);
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [newRoom, setNewRoom] = useState({ name: '', description: '' });
    const [joinForm, setJoinForm] = useState({ meetingId: '', password: '' });
    const [copiedField, setCopiedField] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await studyRoomApi.getRooms();
            if (response.success) {
                setRooms(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async () => {
        if (!newRoom.name.trim()) {
            toast.error('Room name is required');
            return;
        }

        setCreating(true);
        try {
            const response = await studyRoomApi.createRoom(newRoom);
            if (response.success) {
                toast.success('Room created!');
                setShowCreateModal(false);
                setNewRoom({ name: '', description: '' });
                setShowMeetingDetails({
                    roomId: response.data._id,
                    roomName: response.data.name,
                    meetingId: response.meetingDetails.meetingId,
                    password: response.meetingDetails.password,
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create room');
        } finally {
            setCreating(false);
        }
    };

    const handleJoinByMeetingId = async () => {
        if (!joinForm.meetingId.trim() || !joinForm.password.trim()) {
            toast.error('Meeting ID and password are required');
            return;
        }

        setJoining(true);
        try {
            const response = await studyRoomApi.joinByMeetingId(
                joinForm.meetingId.toUpperCase(),
                joinForm.password
            );
            if (response.success) {
                toast.success(response.message || 'Joined room!');
                setShowJoinModal(false);
                setJoinForm({ meetingId: '', password: '' });
                navigate(`/study-rooms/${response.data._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to join room');
        } finally {
            setJoining(false);
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            await studyRoomApi.joinRoom(roomId);
            navigate(`/study-rooms/${roomId}`);
        } catch (error) {
            if (error.response?.data?.message?.includes('already')) {
                navigate(`/study-rooms/${roomId}`);
            } else {
                toast.error(error.response?.data?.message || 'Failed to join room');
            }
        }
    };

    const handleCopy = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    const handleGoToRoom = () => {
        if (showMeetingDetails?.roomId) {
            navigate(`/study-rooms/${showMeetingDetails.roomId}`);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isUserHost = (room) => {
        const userId = user?._id || user?.id;
        const hostId = room.host?._id || room.host;
        const creatorId = room.createdBy?._id || room.createdBy;

        return (hostId?.toString() === userId?.toString()) ||
            (creatorId?.toString() === userId?.toString());
    };

    const handleDeleteRoom = async (e, roomId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to permanently delete this room? This action cannot be undone.')) {
            return;
        }
        try {
            await studyRoomApi.deleteRoom(roomId);
            toast.success('Room deleted successfully');
            setRooms(rooms.filter(r => r._id !== roomId));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete room');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[#1F1F1F] pb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#1F1F1F] text-xs font-medium text-orange-500 mb-4">
                        <Video className="w-3 h-3" />
                        <span>Live Collaboration</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Study Rooms</h1>
                    <p className="text-gray-400">Join a room to collaborate, chat, and learn together in real-time.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setShowJoinModal(true)}
                        className="flex items-center gap-2 px-4 py-3 bg-[#141414] hover:bg-[#1F1F1F] border border-[#1F1F1F] hover:border-orange-500/30 text-gray-300 hover:text-white rounded-xl font-bold text-sm transition-all shadow-lg"
                    >
                        <LogIn className="w-4 h-4" />
                        Join via Code
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-900/20"
                    >
                        <Plus className="w-4 h-4" />
                        New Room
                    </button>
                </div>
            </div>

            {/* Rooms Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                </div>
            ) : rooms.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-dashed border-[#1F1F1F] bg-[#0A0A0A]">
                    <div className="w-20 h-20 bg-[#141414] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Video className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No active rooms</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Be the first to start a study session! Create a room or join with a code.
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 rounded-xl font-bold transition-all border border-orange-600/20"
                    >
                        <Plus className="w-4 h-4" />
                        Create Your First Room
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {rooms.map((room) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={room._id}
                                className="group bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-orange-900/10 relative overflow-hidden"
                                onClick={() => handleJoinRoom(room._id)}
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#141414] flex items-center justify-center border border-[#1F1F1F] group-hover:border-orange-500/30 transition-colors">
                                                <Users className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white leading-tight group-hover:text-orange-500 transition-colors line-clamp-1">
                                                    {room.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{formatTime(room.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {isUserHost(room) && (
                                                <button
                                                    onClick={(e) => handleDeleteRoom(e, room._id)}
                                                    className="p-2 rounded-lg bg-[#141414] hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Room"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${room.participants.length >= room.maxParticipants ? 'border-red-500/30 text-red-500 bg-red-500/10' : 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'}`}>
                                                {room.participants.length}/{room.maxParticipants}
                                            </div>
                                        </div>
                                    </div>

                                    {room.description && (
                                        <p className="text-sm text-gray-400 mb-6 line-clamp-2 h-10 leading-relaxed">
                                            {room.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-[#1F1F1F]">
                                        <div className="flex -space-x-2">
                                            {room.participants.slice(0, 4).map((p, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-7 h-7 rounded-full bg-[#1F1F1F] border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold text-gray-300"
                                                    title={p.user?.name}
                                                >
                                                    {p.user?.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                            ))}
                                            {room.participants.length > 4 && (
                                                <div className="w-7 h-7 rounded-full bg-[#1F1F1F] border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold text-gray-300">
                                                    +{room.participants.length - 4}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform">
                                            Join Room <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showJoinModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-md bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-orange-500" />
                                    Secure Join
                                </h2>
                                <button onClick={() => setShowJoinModal(false)} className="p-2 bg-[#141414] hover:bg-[#1F1F1F] rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-5 relative z-10">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meeting ID</label>
                                    <input
                                        type="text"
                                        value={joinForm.meetingId}
                                        onChange={(e) => setJoinForm({ ...joinForm, meetingId: e.target.value.toUpperCase() })}
                                        maxLength={8}
                                        placeholder="XXXX-XXXX"
                                        className="w-full px-4 py-3 bg-[#141414] border border-[#1F1F1F] focus:border-orange-500 rounded-xl text-white placeholder-gray-600 outline-none transition-colors font-mono text-center tracking-widest uppercase text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Passcode</label>
                                    <input
                                        type="text"
                                        value={joinForm.password}
                                        onChange={(e) => setJoinForm({ ...joinForm, password: e.target.value })}
                                        maxLength={6}
                                        placeholder="••••••"
                                        className="w-full px-4 py-3 bg-[#141414] border border-[#1F1F1F] focus:border-orange-500 rounded-xl text-white placeholder-gray-600 outline-none transition-colors font-mono text-center tracking-widest text-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8 relative z-10">
                                <button
                                    onClick={() => setShowJoinModal(false)}
                                    className="flex-1 py-3 bg-[#141414] hover:bg-[#1F1F1F] text-gray-300 hover:text-white rounded-xl font-bold text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleJoinByMeetingId}
                                    disabled={joining || !joinForm.meetingId || !joinForm.password}
                                    className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join Room'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-md bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-orange-500" />
                                    Create Room
                                </h2>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 bg-[#141414] hover:bg-[#1F1F1F] rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Room Name</label>
                                    <input
                                        type="text"
                                        value={newRoom.name}
                                        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                                        placeholder="e.g. Late Night Calc"
                                        className="w-full px-4 py-3 bg-[#141414] border border-[#1F1F1F] focus:border-orange-500 rounded-xl text-white placeholder-gray-600 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Topic (Optional)</label>
                                    <textarea
                                        value={newRoom.description}
                                        onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                                        placeholder="What's the agenda?"
                                        rows={3}
                                        className="w-full px-4 py-3 bg-[#141414] border border-[#1F1F1F] focus:border-orange-500 rounded-xl text-white placeholder-gray-600 outline-none transition-colors resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 bg-[#141414] hover:bg-[#1F1F1F] text-gray-300 hover:text-white rounded-xl font-bold text-sm transition-colors">Cancel</button>
                                <button onClick={handleCreateRoom} disabled={creating} className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Room'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showMeetingDetails && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-md bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Room Ready!</h2>
                            <p className="text-gray-400 text-sm mb-8">Share these credentials with your team.</p>

                            <div className="space-y-4 text-left">
                                <div className="bg-[#141414] p-4 rounded-xl border border-[#1F1F1F] group cursor-pointer hover:border-orange-500/30 transition-all" onClick={() => handleCopy(showMeetingDetails.meetingId, 'meetingId')}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Meeting ID</span>
                                        {copiedField === 'meetingId' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-600 group-hover:text-white" />}
                                    </div>
                                    <p className="font-mono text-xl tracking-widest text-white">{showMeetingDetails.meetingId}</p>
                                </div>

                                <div className="bg-[#141414] p-4 rounded-xl border border-[#1F1F1F] group cursor-pointer hover:border-orange-500/30 transition-all" onClick={() => handleCopy(showMeetingDetails.password, 'password')}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Passcode</span>
                                        {copiedField === 'password' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-600 group-hover:text-white" />}
                                    </div>
                                    <p className="font-mono text-xl tracking-widest text-white">{showMeetingDetails.password}</p>
                                </div>
                            </div>

                            <button onClick={handleGoToRoom} className="w-full mt-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                Enter Room <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudyRooms;
