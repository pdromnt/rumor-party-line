import { create } from 'zustand';

const usePartyLine = create(() => ({
  partyLines: [],
  partyLine: '',
  rumor: '',
  eventSource: null,
  partyLineDeletedFlag: false,
}));

export default usePartyLine;