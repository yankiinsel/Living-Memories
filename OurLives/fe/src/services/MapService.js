import axios from 'axios';
import { geocodeURL } from '../common/config';

const MapService = {
  async getLocation(lat, lng) {
    const location = await axios.get(`${geocodeURL}${lat}&${lng}`);
    return location;
  },
};

export default MapService;
