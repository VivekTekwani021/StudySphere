import React, { useState } from 'react';
import { resumeApi } from '../../api/resume.api';
import {
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    Loader2,
    ArrowLeft,
    Sparkles,
    TrendingUp,
    Target,
    Tag,
    Briefcase,
    ChevronDown,
    ChevronUp,
    Zap,
    Award,
    GraduationCap,
    Code,
    Layout,
    FileCheck,
    Lightbulb,
    X,
    Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResumeScorer = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [showJobInput, setShowJobInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
                setResult(null);
            } else {
                toast.error('Please upload a PDF file');
            }
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            toast.error('Please upload a resume first');
            return;
        }

        setLoading(true);
        try {
            const response = await resumeApi.analyze(file, jobDescription);
            if (response.success) {
                setResult(response.data);
                toast.success('Resume analyzed successfully!');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to analyze resume');
        } finally {
            setLoading(false);
        }
    };

    // Helper functions tuned for Dark Mode
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-red-400';
    };

    const getScoreGradient = (score) => {
        if (score >= 80) return 'from-emerald-500 to-teal-600';
        if (score >= 60) return 'from-amber-500 to-orange-600';
        return 'from-red-500 to-rose-600';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        if (score >= 60) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-gray-800 text-gray-400';
        }
    };

    const sectionIcons = {
        education: GraduationCap,
        experience: Briefcase,
        skills: Code,
        projects: Lightbulb,
        formatting: Layout
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/placement"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Placement
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg shadow-orange-900/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-1">
                                AI Resume Analyzer
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Get detailed AI-powered feedback with ATS optimization & job matching
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8 mb-8">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-orange-500" />
                        Upload Your Resume
                    </h2>

                    {/* Drag & Drop Zone */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${dragActive
                                ? 'border-orange-500 bg-orange-500/10'
                                : 'border-[#333] hover:border-gray-500 bg-[#141414]'
                            }`}
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        {file ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 bg-[#1F1F1F] rounded-2xl border border-[#333]">
                                    <FileText className="w-10 h-10 text-orange-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-white text-lg">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                                <button className="text-sm text-red-400 hover:text-red-300 transition-colors" onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setFile(null);
                                    setResult(null);
                                }}>
                                    Remove file
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 bg-[#1F1F1F] rounded-full">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-white text-lg mb-1">
                                        Drag & drop your resume
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        or click to browse (PDF only, max 5MB)
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Job Description Toggle */}
                    <div className="mt-6">
                        <button
                            onClick={() => setShowJobInput(!showJobInput)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            {showJobInput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {showJobInput ? 'Hide' : 'Add'} Job Description (Optional)
                        </button>

                        {showJobInput && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job description here to get match probability and tailored suggestions..."
                                    rows={6}
                                    className="w-full px-4 py-3 bg-[#141414] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                                />
                            </div>
                        )}
                    </div>

                    {/* Analyze Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={!file || loading}
                        className={`w-full mt-8 py-3 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${!file || loading
                                ? 'bg-[#1F1F1F] text-gray-500 cursor-not-allowed border border-[#333]'
                                : 'bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-900/20'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing Resume...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Analyze with AI
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Score Overview */}
                        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                {/* Main Score */}
                                <div className="flex-shrink-0">
                                    <div className={`w-40 h-40 rounded-full flex items-center justify-center bg-gradient-to-br p-1 ${getScoreGradient(result.score)}`}>
                                        <div className="w-full h-full rounded-full bg-[#0A0A0A] flex flex-col items-center justify-center">
                                            <span className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                                                {result.score}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                                                Score
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary & ATS Score */}
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        Analysis Complete
                                    </h3>
                                    <p className="text-gray-400 mb-6 leading-relaxed">
                                        {result.summary}
                                    </p>

                                    {result.atsScore !== undefined && (
                                        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getScoreBg(result.atsScore)}`}>
                                                <FileCheck className="w-4 h-4" />
                                                <span className="text-sm font-medium">
                                                    ATS Score: {result.atsScore}%
                                                </span>
                                            </div>
                                            {result.jobMatch && (
                                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getScoreBg(result.jobMatch.matchScore)}`}>
                                                    <Target className="w-4 h-4" />
                                                    <span className="text-sm font-medium">
                                                        Job Match: {result.jobMatch.matchScore}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Job Match Analysis */}
                            {result.jobMatch && (
                                <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-[#141414] rounded-lg border border-[#222]">
                                            <Briefcase className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">
                                            Job Match Analysis
                                        </h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-medium mb-3 text-emerald-400 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Matched Skills ({result.jobMatch.matchedSkills?.length || 0})
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.jobMatch.matchedSkills?.map((skill, idx) => (
                                                    <span key={idx} className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium mb-3 text-red-400 flex items-center gap-2">
                                                <XCircle className="w-4 h-4" />
                                                Missing Skills ({result.jobMatch.missingSkills?.length || 0})
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.jobMatch.missingSkills?.map((skill, idx) => (
                                                    <span key={idx} className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Strengths */}
                            {result.strengths && result.strengths.length > 0 && (
                                <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-[#141414] rounded-lg border border-[#222]">
                                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">
                                            Key Strengths
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        {result.strengths.map((strength, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <div className="mt-1">
                                                    <Check className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-white text-sm">
                                                        {typeof strength === 'object' ? strength.title : strength}
                                                    </h4>
                                                    {typeof strength === 'object' && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {strength.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section Analysis */}
                        {result.sectionAnalysis && (
                            <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-6">
                                    Section-by-Section Analysis
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {Object.entries(result.sectionAnalysis).map(([section, data]) => {
                                        const Icon = sectionIcons[section] || FileText;
                                        return (
                                            <button
                                                key={section}
                                                onClick={() => setExpandedSection(expandedSection === section ? null : section)}
                                                className={`p-4 rounded-xl text-center transition-all cursor-pointer border ${expandedSection === section
                                                        ? 'bg-[#141414] border-orange-500'
                                                        : 'bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#333]'
                                                    }`}
                                            >
                                                <div className="flex justify-center mb-2">
                                                    <Icon className={`w-6 h-6 ${getScoreColor(data.score)}`} />
                                                </div>
                                                <p className={`text-xl font-bold ${getScoreColor(data.score)}`}>
                                                    {data.score}
                                                </p>
                                                <p className="text-xs text-gray-500 capitalize mt-1">
                                                    {section}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>

                                {expandedSection && result.sectionAnalysis[expandedSection] && (
                                    <div className="mt-6 p-6 rounded-xl bg-[#141414] border border-[#222] animate-in slide-in-from-top-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-white capitalize flex items-center gap-2">
                                                {expandedSection} Feedback
                                                <span className={`px-2 py-0.5 rounded text-xs border ${getScoreBg(result.sectionAnalysis[expandedSection].score)}`}>
                                                    Score: {result.sectionAnalysis[expandedSection].score}
                                                </span>
                                            </h4>
                                            <button onClick={() => setExpandedSection(null)} className="text-gray-500 hover:text-white">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {result.sectionAnalysis[expandedSection].feedback}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Areas to Improve */}
                        {result.improvements && result.improvements.length > 0 && (
                            <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-[#141414] rounded-lg border border-[#222]">
                                        <Target className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">
                                        Areas to Improve
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {result.improvements.map((improvement, idx) => (
                                        <div key={idx} className="p-4 rounded-xl bg-[#141414] border border-[#222] hover:border-amber-500/30 transition-colors">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h4 className="font-semibold text-white text-sm">
                                                    {typeof improvement === 'object' ? improvement.title : improvement}
                                                </h4>
                                                {typeof improvement === 'object' && improvement.priority && (
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${getPriorityColor(improvement.priority)}`}>
                                                        {improvement.priority}
                                                    </span>
                                                )}
                                            </div>
                                            {typeof improvement === 'object' && (
                                                <>
                                                    <p className="text-xs text-gray-500 mb-3">
                                                        {improvement.description}
                                                    </p>
                                                    {improvement.suggestion && (
                                                        <div className="flex gap-2 items-start text-xs bg-[#0A0A0A] p-3 rounded-lg border border-[#1F1F1F]">
                                                            <Lightbulb className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                            <span className="text-gray-400">
                                                                <span className="text-orange-500 font-medium">Tip: </span>
                                                                {improvement.suggestion}
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggested Keywords */}
                        {result.suggestedKeywords && result.suggestedKeywords.length > 0 && (
                            <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#141414] rounded-lg border border-[#222]">
                                        <Tag className="w-5 h-5 text-cyan-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">
                                        Suggested Keywords
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">
                                    Add these keywords to pass ATS filters for this role:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.suggestedKeywords.map((keyword, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 text-xs font-medium rounded-full bg-cyan-900/10 text-cyan-400 border border-cyan-500/20"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeScorer;
