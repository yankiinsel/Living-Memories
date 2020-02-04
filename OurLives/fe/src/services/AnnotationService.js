import axios from 'axios';
import { baseURL } from '../common/config';

const AnnotationService = {
  async get(param, callback) {
    const url = `${baseURL}/getAnnotations/${param}`;
    await axios.get(url)
      .then((res) => {
        callback(res);
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

};

export default AnnotationService;
