import {useState} from "react";
import {useSelector} from "react-redux";
import {AxiosPromise} from "axios";
import {LocationOption, RootState, UserRole} from "../types";
import {MessageType, useMessage} from "../components/Providers/MessageProvider";
import {LocationService} from "../services";

type UserData = {
  user: RootState["user"];
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export const useUser = (): UserData => {
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = user.isAuthenticated;
  const isAdmin = user.role === UserRole.ADMIN;
  return {user, isAuthenticated, isAdmin};
};

export const useRequest = () => {
  const [isLoading, setLoading] = useState<boolean>(true);

  const handleRequest = async (request: AxiosPromise) => {
    try {
      const {data} = await request;
      return data;
    } catch (err) {
      throw(err);
    } finally {
      setLoading(() => false);
    }
  };

  return {isLoading, setLoading, handleRequest};
};

export const useToasterCatcher = () => {
  const {isLoading, setLoading, handleRequest} = useRequest();
  const {pushMessage} = useMessage();

  const catchAndTossError = async (request: AxiosPromise) => {
    try {
      const data = await handleRequest(request);
      return data;
    } catch (err) {
      pushMessage({title: err.response?.data?.message || err.message, type: MessageType.ERROR});
    }
  }

  return {isLoading, setLoading, catchAndTossError};
};

export const useLocations = () => {
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [defaultLocation, setDefaultLocation] = useState<LocationOption>({id: "", description: ""});
  const {isLoading, catchAndTossError} = useToasterCatcher();

  const fetchLocations = async ({onlyWithWorkspaces}: {onlyWithWorkspaces: boolean}) => {
    const fetchedLocations: LocationOption[] = await catchAndTossError(LocationService.list({onlyWithWorkspaces}));
    setLocations(() => fetchedLocations);
    checkStoredLocation(fetchedLocations);
  }

  const checkStoredLocation = (fetchedLocations: LocationOption[]) => {
    const storedLocation = localStorage.getItem("location");
    if (!storedLocation) return;

    const parsedLocation = JSON.parse(storedLocation);
    const storedLocationFetched = fetchedLocations.find(loc => loc.id === parsedLocation.id);
    storedLocationFetched ? setDefaultLocation(() => parsedLocation) : localStorage.removeItem("location");
  }

  return {locations, setLocations, locationsLoading: isLoading, defaultLocation, fetchLocations};
};
