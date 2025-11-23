import { getServer } from "../helpers/getServer.js";
import usePartyLine from "../store/store.js";

const fetchPartyLines = async () => {
  fetch(getServer() + '/partyLines')
    .then(response => response.json())
    .then(data => {
      usePartyLine.setState({partyLines: data});
    })
    .catch(error => {
      console.error('Error fetching PartyLines:', error);
    });
};

const createPartyLine = async (partyLine) => {
  return fetch(getServer() + '/createPartyLine', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyLine }),
  })
    .then(async response => {
      if (response.ok) {
        await fetchPartyLines();
      } else {
        console.error('Failed to create PartyLine');
      }

      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error creating PartyLine:', error);
      throw error;
    });
};

const deletePartyLine = async (partyLine) => {
  fetch(getServer() + '/deletePartyLine', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyLine }),
  })
    .then(response => {
      if (response.ok) {
        console.log(`Deleted PartyLine: ${partyLine}`);
        return fetchPartyLines(); // Refresh the PartyLines after deletion
      } else {
        console.error('Failed to delete PartyLine');
      }
    })
    .catch(error => {
      console.error('Error deleting PartyLine:', error);
    });
};

export { fetchPartyLines, createPartyLine, deletePartyLine };