import BaseService from './BaseService';
import { baseURL } from '../common/config';

const StoryService = {
  async getAllStories(callback) {
    const url = `${baseURL}/memories`;
    await BaseService.get(url)
      .then((res) => {
        callback(res);
      }).catch((error) => {
        throw new Error(error);
      });
  },

  async getStory(id, callback) {
    const url = `${baseURL}/memory/${id}`;
    await BaseService.get(url)
      .then((res) => {
        callback(res);
      }).catch((error) => {
        throw new Error(error);
      });
  },

  async post(memory, callback) {
    const url = `${baseURL}/postMemory`;
    await BaseService.post(url, memory)
      .then((res) => {
        callback(res);
      }).catch((error) => {
        throw new Error(error);
      });
  },

  async delete(id, callback) {
    const url = `${this.baseURL}/deleteMemory`;

    await BaseService.delete(url, {
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
