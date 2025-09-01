// Resolve API base URL for web, iOS, Android, and device
import { Platform } from 'react-native';

// On Android emulator, localhost of the host machine is 10.0.2.2
const ANDROID_HOST = 'http://10.0.2.2:8000';
// On iOS simulator and web in same machine, localhost works
const LOCALHOST = 'http://localhost:8000';

export const API_BASE_URL = Platform.select({
  android: ANDROID_HOST,
  ios: LOCALHOST,
  default: LOCALHOST,
});
