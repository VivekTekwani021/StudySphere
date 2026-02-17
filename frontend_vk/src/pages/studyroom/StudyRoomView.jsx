import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studyRoomApi } from '../../api/studyRoom.api';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft, Users, Send, Loader2, Trash2, LogOut, Circle,
    MessageSquare, Pencil, Key, Copy, Check, Crown, RefreshCw,
    Settings, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const StudyRoomView = () => {
    const { id: roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messageInput, setMessageInput] = useState('');
    const [activeTab, setActiveTab] = useState('chat');
    const [showSettings, setShowSettings] = useState(false);
    const [copiedField, setCopiedField] = useState(null);
    const [isHost, setIsHost] = useState(false);

    const messagesEndRef = useRef(null);
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const {
        isConnected,
        messages,
        setMessages,
        participants,
        setParticipants,
        sendMessage,
        emitDraw,
        clearCanvas,
        onDraw,
        onClearCanvas,
    } = useSocket(roomId, user?._id, user?.name);

    useEffect(() => {
        fetchRoom();
    }, [roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (canvasRef.current && activeTab === 'whiteboard') {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            ctx.strokeStyle = '#f97316'; // Orange accent
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';

            onDraw((drawData) => {
                ctx.beginPath();
                ctx.moveTo(drawData.fromX, drawData.fromY);
                ctx.lineTo(drawData.toX, drawData.toY);
                ctx.stroke();
            });

            onClearCanvas(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });
        }
    }, [activeTab]);

    const fetchRoom = async () => {
        try {
            const response = await studyRoomApi.getRoom(roomId);
            if (response.success) {
                setRoom(response.data);

                const userId = user?._id || user?.id;
                const hostId = response.data.host?._id || response.data.host;
                const creatorId = response.data.createdBy?._id || response.data.createdBy;
                const isUserHost = (hostId?.toString() === userId?.toString()) ||
                    (creatorId?.toString() === userId?.toString());

                setIsHost(isUserHost);

                setMessages(response.data.messages || []);
                setParticipants(response.data.participants.map(p => ({
                    ...p.user,
                    role: p.role
                })) || []);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load room');
            navigate('/study-rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim()) {
            sendMessage(messageInput);
            setMessageInput('');
        }
    };

    const handleLeaveRoom = async () => {
        try {
            await studyRoomApi.leaveRoom(roomId);
            toast.success('Left the room');
            navigate('/study-rooms');
        } catch (error) {
            console.error(error);
            navigate('/study-rooms');
        }
    };

    const handleCloseRoom = async () => {
        if (!window.confirm('Are you sure you want to close this room? All participants will be removed.')) return;
        try {
            await studyRoomApi.closeRoom(roomId);
            toast.success('Room closed');
            navigate('/study-rooms');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to close room');
        }
    };

    const handleRegeneratePassword = async () => {
        try {
            const response = await studyRoomApi.regeneratePassword(roomId);
            if (response.success) {
                setRoom(prev => ({ ...prev, password: response.password }));
                toast.success('Password regenerated!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to regenerate password');
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

    const startDrawing = (e) => {
        if (activeTab !== 'whiteboard') return;
        isDrawing.current = true;
        const rect = canvasRef.current.getBoundingClientRect();
        lastPos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const draw = (e) => {
        if (!isDrawing.current || activeTab !== 'whiteboard') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const currentPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();

        emitDraw({
            fromX: lastPos.current.x,
            fromY: lastPos.current.y,
            toX: currentPos.x,
            toY: currentPos.y,
        });

        lastPos.current = currentPos;
    };

    const stopDrawing = () => {
        isDrawing.current = false;
    };

    const handleClearCanvas = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        clearCanvas();
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-black text-white font-sans h-screen overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F1F1F] bg-[#0A0A0A]">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/study-rooms')}
                        className="p-2 rounded-lg hover:bg-[#141414] text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-white max-w-[200px] truncate">
                                {room?.name}
                            </h1>
                            {isHost && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-wider border border-amber-500/20">
                                    <Crown className="w-3 h-3" />
                                    Host
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500"}`}></div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                                {isConnected ? 'Live' : 'Connecting...'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isHost && (
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] text-gray-400 hover:text-white transition-colors border border-[#1F1F1F]"
                            title="Meeting Info"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                    )}

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] border border-[#1F1F1F]">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-bold text-gray-300">
                            {participants.length}
                        </span>
                    </div>

                    <button
                        onClick={handleLeaveRoom}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141414] hover:bg-red-500/10 border border-[#1F1F1F] hover:border-red-500/30 text-gray-400 hover:text-red-500 font-bold text-sm transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Leave
                    </button>

                    {isHost && (
                        <button
                            onClick={handleCloseRoom}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors"
                            title="Close Room for Everyone"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Participants */}
                <div className="w-72 border-r border-[#1F1F1F] bg-[#0A0A0A] flex flex-col hidden md:flex">
                    <div className="px-5 py-4 border-b border-[#1F1F1F]">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Participants ({participants.length})
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {participants.map((p, idx) => (
                            <div
                                key={p._id || idx}
                                className="flex items-center gap-3 p-3 rounded-xl bg-[#141414] border border-[#1F1F1F] hover:border-orange-500/30 transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-[#1F1F1F] group-hover:bg-orange-600/20 flex items-center justify-center text-white text-xs font-bold border border-[#2A2A2A] group-hover:border-orange-500/30 transition-colors">
                                    {p.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-white truncate">
                                            {p.name}
                                        </p>
                                        {p.role === 'host' && (
                                            <Crown className="w-3 h-3 text-amber-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat / Whiteboard Area */}
                <div className="flex-1 flex flex-col bg-[#050505] relative">
                    {/* Tabs */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex p-1 bg-[#141414] border border-[#1F1F1F] rounded-xl shadow-xl">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                activeTab === 'chat'
                                    ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20"
                                    : "text-gray-400 hover:text-white hover:bg-[#1F1F1F]"
                            )}
                        >
                            <MessageSquare className="w-3 h-3" />
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('whiteboard')}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                activeTab === 'whiteboard'
                                    ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20"
                                    : "text-gray-400 hover:text-white hover:bg-[#1F1F1F]"
                            )}
                        >
                            <Pencil className="w-3 h-3" />
                            Board
                        </button>
                    </div>

                    {/* Chat Panel */}
                    {activeTab === 'chat' && (
                        <div className="flex-1 flex flex-col pt-16">
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-[#1F1F1F] scrollbar-track-transparent">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={msg.isSystem ? 'flex justify-center my-4' : ''}>
                                        {msg.isSystem ? (
                                            <span className="text-[10px] px-3 py-1 rounded-full bg-[#141414] border border-[#1F1F1F] text-gray-500 font-mono uppercase tracking-widest">
                                                {msg.content}
                                            </span>
                                        ) : (
                                            <div className={clsx(
                                                "max-w-[70%] p-4 rounded-2xl border transition-all",
                                                msg.sender?._id === user?._id
                                                    ? "ml-auto bg-orange-600/10 border-orange-600/20 text-white rounded-br-sm"
                                                    : "bg-[#141414] border-[#1F1F1F] text-gray-200 rounded-bl-sm"
                                            )}>
                                                {msg.sender?._id !== user?._id && (
                                                    <p className="text-xs font-bold text-orange-500 mb-1">
                                                        {msg.sender?.name}
                                                    </p>
                                                )}
                                                <p className="text-sm leading-relaxed text-gray-300">{msg.content}</p>
                                                <p className="text-[10px] mt-2 text-right text-gray-600 font-mono opacity-60">
                                                    {formatTime(msg.timestamp)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 bg-[#0A0A0A] border-t border-[#1F1F1F]">
                                <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-5 py-3 rounded-xl bg-[#141414] border border-[#1F1F1F] focus:border-orange-500/50 text-white placeholder-gray-600 outline-none transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim()}
                                        className="px-5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center shadow-lg shadow-orange-900/20"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Whiteboard Panel */}
                    {activeTab === 'whiteboard' && (
                        <div className="flex-1 flex flex-col p-4 pt-16 relative">
                            <div className="absolute top-4 right-4 z-20">
                                <button
                                    onClick={handleClearCanvas}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#1F1F1F] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 text-gray-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Clear Board
                                </button>
                            </div>
                            <div className="flex-1 bg-[#0A0A0A] rounded-2xl border border-[#1F1F1F] overflow-hidden relative">
                                <div className="absolute inset-0 bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    className="w-full h-full cursor-crosshair touch-none"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Meeting Info Modal */}
            <AnimatePresence>
                {showSettings && isHost && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Key className="w-5 h-5 text-orange-500" />
                                    <h2 className="text-xl font-bold text-white">Meeting Details</h2>
                                </div>
                                <button onClick={() => setShowSettings(false)} className="p-2 bg-[#141414] hover:bg-[#1F1F1F] rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-[#141414] p-4 rounded-xl border border-[#1F1F1F] group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Meeting ID</span>
                                        <button onClick={() => handleCopy(room?.meetingId, 'meetingId')} className="text-gray-600 hover:text-white group-hover:block transition-colors">
                                            {copiedField === 'meetingId' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                    <p className="font-mono text-xl tracking-widest text-white">{room?.meetingId}</p>
                                </div>

                                <div className="bg-[#141414] p-4 rounded-xl border border-[#1F1F1F] group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Passcode</span>
                                        <div className="flex gap-2">
                                            <button onClick={handleRegeneratePassword} className="text-gray-600 hover:text-orange-500 transition-colors" title="Regenerate">
                                                <RefreshCw className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => handleCopy(room?.password, 'password')} className="text-gray-600 hover:text-white transition-colors">
                                                {copiedField === 'password' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="font-mono text-xl tracking-widest text-white">{room?.password}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudyRoomView;
