import axios from 'axios';
import { baseURL } from './../common/config';

const StoryService = {
  async get(path, callback) {
    const url = `${baseURL}/${path}`;
    axios.get(url)
      .then((response) => {
        callback(response);
      })
      .catch((error) => {
        throw new Error(error);
      });
  },
};

export default StoryService;
