import jsonwebtoken from 'jsonwebtoken';
import User from '../models/User.model';
import { getMain } from '../clients';

const JWTSecret = process.env.JWT_SECRET || '';

/* eslint-disable no-underscore-dangle, no-return-assign, no-param-reassign */
export const getGameObject = async (token: any, id: any) => {
  const decodedToken: any = token !== 'null' ? jsonwebtoken.verify(token, JWTSecret) : null;

  if (!token || !decodedToken || decodedToken.id !== getMain()) {
    const err: any = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }

  const user: any = await User.findOne({ _id: id });

  const data = {
    username: user.username,
    score: user.score,
  };
  return data;
};

export const saveGameState = async (token: any, data: any) => {
  const decodedToken: any = jsonwebtoken.verify(token, JWTSecret);
  if (!token || !decodedToken.id || decodedToken.id !== getMain()) {
    const err: any = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
  try {
    const promises = data.map((x: any) => User.updateOne(
      { _id: x.playerId },
      { $set: { score: x.score } },
      { new: true, runValidators: true, context: 'query' },
    ));
    const pro = await Promise.all(promises);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to save game state');
  }
  return true;
};
