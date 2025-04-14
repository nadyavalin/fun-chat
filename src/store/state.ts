import { State } from "../types/types";

export const state: State = {
  id: "",
  login: "",
  password: "",
  authorizedUsers: [],
  unauthorizedUsers: [],
  selectedUser: undefined,
  selectedMessageId: undefined,
};

export default state;
