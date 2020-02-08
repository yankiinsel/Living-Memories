import axios from 'axios';
import { baseURL } from '../common/config';

const StoryService = {

  async getAllMemories(callback) {
    const url = `${baseURL}/memories`;
    await axios.get(url)
      .then((res) => {
        callback(res);
      }).catch((error) => {
        throw new Error(error);
      });
  },

  async getMemory(id, callback) {
    await axios.get(`${baseURL}/memory/${id}`)
      .then((res) => {
        callback(res);
      }).catch((error) => {
        throw new Error(error);
      });
  },

  async post(memory, callback) {
    await axios.post(`${baseURL}/postMemory`, memory)
      .then((res) => {
        callback(res);
      }).catch((error) => {
        throw new Error(error);
      });
  },

  async delete(id, callback) {
    await axios
      .delete(`${this.baseURL}/deleteMemory`, {
        data: {
          id,
        },
      })
      .then((res) => {
        callback(res);
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

};

export default StoryService;
