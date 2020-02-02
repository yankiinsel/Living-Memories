import axios from 'axios';
import { baseURL } from '../common/config';


const StoryService = {
  get(resource, slug = '') {
    axios.get(`${baseURL}/${resource}/${slug}`)
      .catch((error) => {
        throw new Error(error);
      });
  },

};

export default StoryService;
