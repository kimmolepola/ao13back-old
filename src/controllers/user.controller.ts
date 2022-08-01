import {
  checkOkToStart,
  getUser,
  updateUsername,
} from '../services/user.service';

const getTokenFrom = (request: any) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

export const checkOkToStartController = (req: any, res: any, next: any) => {
  const token = getTokenFrom(req);
  const checkOkToStartService = checkOkToStart(token);
  return res.json(checkOkToStartService);
};

export const getUserController = async (req: any, res: any, next: any) => {
  const token = getTokenFrom(req);
  const getUserService = await getUser(token);
  return res.json(getUserService);
};

export const updateUsernameController = async (req: any, res: any, next: any) => {
  const token = getTokenFrom(req);
  const updateUsernameService = await updateUsername(token, req.body);
  return res.json(updateUsernameService);
};
