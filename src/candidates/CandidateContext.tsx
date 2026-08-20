/**
 * Candidate store dùng chung — để nhiều màn cùng đọc/ghi danh sách ứng viên.
 *  - Màn "Quản lý ứng viên" (CandidatePage) dùng candidates/setCandidates.
 *  - Màn "Yêu cầu tuyển dụng" gán/bỏ ứng viên vào 1 yêu cầu (assign/unassign theo requestId).
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Candidate, INITIAL_CANDIDATES } from '../components/CandidatePage';

interface CandidateContextValue {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  assignToRequest: (candidateId: string, requestId: string) => void;
  unassignFromRequest: (candidateId: string, requestId: string) => void;
}

const CandidateContext = createContext<CandidateContextValue | null>(null);

export const CandidateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>(() => INITIAL_CANDIDATES);

  const assignToRequest: CandidateContextValue['assignToRequest'] = (candidateId, requestId) => {
    if (!requestId) return;
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? c.applications.some((a) => a.requestId === requestId)
            ? c
            : { ...c, applications: [...c.applications, { requestId, finalStatus: 'New' }] }
          : c,
      ),
    );
  };

  const unassignFromRequest: CandidateContextValue['unassignFromRequest'] = (candidateId, requestId) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? { ...c, applications: c.applications.filter((a) => a.requestId !== requestId) }
          : c,
      ),
    );
  };

  const value = useMemo<CandidateContextValue>(
    () => ({ candidates, setCandidates, assignToRequest, unassignFromRequest }),
    [candidates],
  );

  return <CandidateContext.Provider value={value}>{children}</CandidateContext.Provider>;
};

export function useCandidates(): CandidateContextValue {
  const ctx = useContext(CandidateContext);
  if (!ctx) throw new Error('useCandidates must be used within a CandidateProvider');
  return ctx;
}
