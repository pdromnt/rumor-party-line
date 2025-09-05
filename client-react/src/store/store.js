import { create } from 'zustand';

const usePartyLine = create(() => ({
  partyLines: [],
  partyLine: '',
  rumor: '',
  eventSource: undefined,
  partyLineDeletedFlag: false,
}));

export default usePartyLine;