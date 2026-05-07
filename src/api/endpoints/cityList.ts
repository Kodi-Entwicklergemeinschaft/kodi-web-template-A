import apiRequest from '@/api/apiRequest';
import API_URLS from '@/api/apiURl';

export type CityEmailTheme = {
  buttonColor: string;
  buttonTextColor: string;
  footerBackgroundColor: string;
  headerBackgroundColor: string;
};

export type CityMetadata = {
  emailTheme: {
    appName: string;
    emailTheme: CityEmailTheme;
    accentColor: string;
    primaryColor: string;
    appNameDisplay: string;
    secondaryColor: string;
    greetingTemplate: string;
  };
};

export type CityItem = {
  id: string;
  name: string;
  country: string;
  state: string | null;
  latitude: number;
  longitude: number;
  population: number;
  timezone: string;
  metadata: CityMetadata;
  parentCityId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetCityListDataResponse = {
  success: boolean;
  items: CityItem[];
  message: string;
  timestamp: string;
  path: string;
  status: number;
};

export const getCityList = async () => {
  return await apiRequest<GetCityListDataResponse>({
    url: API_URLS.GetAllCities,
    method: 'GET',
  });
};
