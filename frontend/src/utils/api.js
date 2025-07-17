import axios from 'axios';
import { getToken } from './auth';

// Generic delete (returns true/false)
export async function deleteItem(url) {
  try {
    await axios.delete(url, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return true;
  } catch (err) {
    return false;
  }
}
