import axios from 'axios';

const BaseService = {
  async get(url) {
    await axios.get(url);
  },

  async post(url, payload) {
    await axios.post(url, payload);
  },

  async delete(url, id) {
    await axios
      .delete(url, {
        data: {
          id,
        },
      });
  },
};

export default BaseService;
