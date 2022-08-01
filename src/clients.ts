let main: any;
const clients: any = {};

export const addClientUnique = (id: any, socket: any) => {
  if (clients[id]) {
    return false;
  }
  clients[id] = socket;
  return true;
};

export const removeClient = (id: any) => {
  delete clients[id];
};

export const getClients = () => clients;

export const setMain = (x: any) => {
  main = x;
};

export const getMain = () => main;
