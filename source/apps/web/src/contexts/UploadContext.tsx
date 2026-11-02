'use client';

import { ENDPOINTS } from '@/lib/endpoints';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'paused';
  progress: number;
  error?: string;
  createdAt: Date;
  relativePath?: string; // For directory uploads
  isFromDirectory?: boolean;
  uploadPath?: 'default' | 'assets'; // Upload path option
}

interface UploadSession {
  id: string;
  files: UploadFile[];
  totalFiles: number;
  completedFiles: number;
  totalSize: number;
  uploadedSize: number;
  isActive: boolean;
  createdAt: Date;
}

interface UploadContextType {
  sessions: UploadSession[];
  currentSession: UploadSession | null;
  addFiles: (files: File[], options?: { isFromDirectory?: boolean; relativePaths?: string[]; uploadPath?: 'default' | 'assets' }) => void;
  removeFile: (sessionId: string, fileId: string) => void;
  pauseUpload: (sessionId: string, fileId: string) => void;
  resumeUpload: (sessionId: string, fileId: string) => void;
  retryUpload: (sessionId: string, fileId: string) => void;
  clearSession: (sessionId: string) => void;
  clearAllSessions: () => void;
  getOverallProgress: () => number;
  getActiveUploadsCount: () => number;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

const STORAGE_KEY = 'upload_sessions';

export function UploadProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<UploadSession[]>([]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSessions = JSON.parse(stored);
        // Convert date strings back to Date objects
        const sessionsWithDates = parsedSessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          files: session.files.map((file: any) => ({
            ...file,
            createdAt: new Date(file.createdAt),
          })),
        }));
        setSessions(sessionsWithDates);
      }
    } catch (error) {
      console.error('Failed to load upload sessions:', error);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save upload sessions:', error);
    }
  }, [sessions]);

  // Get current active session or create new one
  const getCurrentSession = (): UploadSession => {
    let currentSession = sessions.find((s) => s.isActive);

    if (!currentSession) {
      const newSession: UploadSession = {
        id: `session_${Date.now()}`,
        files: [],
        totalFiles: 0,
        completedFiles: 0,
        totalSize: 0,
        uploadedSize: 0,
        isActive: true,
        createdAt: new Date(),
      };
      setSessions((prev) => [...prev, newSession]);
      return newSession;
    }

    return currentSession;
  };

  const addFiles = (
    files: File[],
    options?: { isFromDirectory?: boolean; relativePaths?: string[]; uploadPath?: 'default' | 'assets' },
  ) => {
    const session = getCurrentSession();
    const { isFromDirectory = false, relativePaths = [], uploadPath = 'default' } = options || {};

    const newFiles: UploadFile[] = files.map((file, index) => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      relativePath: relativePaths[index] || file.webkitRelativePath || undefined,
      isFromDirectory,
      uploadPath,
    }));

    const updatedSession = {
      ...session,
      files: [...session.files, ...newFiles],
      totalFiles: session.totalFiles + newFiles.length,
      totalSize: session.totalSize + newFiles.reduce((sum, f) => sum + f.size, 0),
    };

    setSessions((prev) => prev.map((s) => (s.id === session.id ? updatedSession : s)));

    // Start uploading files one by one
    startUploadProcess(session.id, newFiles);
  };

  const startUploadProcess = async (sessionId: string, files: UploadFile[]) => {
    for (const uploadFile of files) {
      await uploadSingleFile(sessionId, uploadFile.id);
    }
  };

  const uploadSingleFile = async (sessionId: string, fileId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    const uploadFile = session?.files.find((f) => f.id === fileId);

    if (!uploadFile || uploadFile.status === 'success') return;

    // Update status to uploading
    updateFileStatus(sessionId, fileId, 'uploading', 0);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile.file);
      formData.append('upload_path', uploadFile.uploadPath || 'default');

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        const currentSession = sessions.find((s) => s.id === sessionId);
        const currentFile = currentSession?.files.find((f) => f.id === fileId);

        if (currentFile && currentFile.status === 'uploading' && currentFile.progress < 90) {
          const newProgress = Math.min(currentFile.progress + Math.random() * 15, 90);
          updateFileStatus(sessionId, fileId, 'uploading', newProgress);
        }
      }, 500);

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${ENDPOINTS.FILES.POST.upload.single}`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (response.ok) {
        updateFileStatus(sessionId, fileId, 'success', 100);
        toast.success(`${uploadFile.name} uploaded successfully`);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      updateFileStatus(sessionId, fileId, 'error', uploadFile.progress);
      toast.error(`Failed to upload ${uploadFile.name}`);
    }
  };

  const updateFileStatus = (sessionId: string, fileId: string, status: UploadFile['status'], progress: number) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedFiles = session.files.map((file) => (file.id === fileId ? { ...file, status, progress } : file));

          const completedFiles = updatedFiles.filter((f) => f.status === 'success').length;
          const uploadedSize = updatedFiles.reduce((sum, f) => sum + (f.progress / 100) * f.size, 0);

          return {
            ...session,
            files: updatedFiles,
            completedFiles,
            uploadedSize,
          };
        }
        return session;
      }),
    );
  };

  const removeFile = (sessionId: string, fileId: string) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedFiles = session.files.filter((f) => f.id !== fileId);
          const fileToRemove = session.files.find((f) => f.id === fileId);

          return {
            ...session,
            files: updatedFiles,
            totalFiles: updatedFiles.length,
            totalSize: session.totalSize - (fileToRemove?.size || 0),
          };
        }
        return session;
      }),
    );
  };

  const pauseUpload = (sessionId: string, fileId: string) => {
    updateFileStatus(sessionId, fileId, 'paused', 0);
  };

  const resumeUpload = (sessionId: string, fileId: string) => {
    uploadSingleFile(sessionId, fileId);
  };

  const retryUpload = (sessionId: string, fileId: string) => {
    uploadSingleFile(sessionId, fileId);
  };

  const clearSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const clearAllSessions = () => {
    setSessions([]);
  };

  const getOverallProgress = () => {
    if (sessions.length === 0) return 0;

    const totalFiles = sessions.reduce((sum, s) => sum + s.totalFiles, 0);
    const completedFiles = sessions.reduce((sum, s) => sum + s.completedFiles, 0);

    return totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;
  };

  const getActiveUploadsCount = () => {
    return sessions.reduce((sum, session) => sum + session.files.filter((f) => f.status === 'uploading').length, 0);
  };

  const value: UploadContextType = {
    sessions,
    currentSession: sessions.find((s) => s.isActive) || null,
    addFiles,
    removeFile,
    pauseUpload,
    resumeUpload,
    retryUpload,
    clearSession,
    clearAllSessions,
    getOverallProgress,
    getActiveUploadsCount,
  };

  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}
