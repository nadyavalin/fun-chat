import { State } from "../types/types";

export const state: State = {
  login: "",
  password: "",
  authorizedUsers: [],
  unauthorizedUsers: [],
  selectedUser: null,
  selectedMessageId: null,
};

export default state;
