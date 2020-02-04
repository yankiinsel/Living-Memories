import axios from 'axios';
import { baseURL } from '../common/config';

const StoryService = {
  async getAllMemories(callback) {
    const url = `${baseURL}/memories`;
    await axios.get(url)
      .then((res) => {
        callback(res);
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

  async getMemory(id, callback) {
    await axios.get(`${baseURL}/memory/${id}`)
      .then((res) => {
        callback(res);
      });
  },

};

export default StoryService;
