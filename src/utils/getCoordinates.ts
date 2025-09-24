import Geocode from 'react-geocode';
import { HOST_GOOGLE_API_KEY } from 'src/config-global';

export const getCoordinates = async (newAddress: any) => {
  try {
    const addressString = `${newAddress.street}, ${newAddress.number}, ${newAddress.city}, ${newAddress.state}, ${newAddress.zip_code}`;
    const response = await Geocode.fromAddress(addressString, HOST_GOOGLE_API_KEY, 'pt', 'br');
    const { lat, lng } = response.results[0].geometry.location;
    return { longitude: lng, latitude: lat };
  } catch (error) {
    throw new Error('Endereço não encontrado');
  }
};
