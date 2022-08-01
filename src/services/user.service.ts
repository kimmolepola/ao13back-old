import JWT from 'jsonwebtoken';
import User from '../models/User.model';
import { getMain, getClients } from '../clients';

const JWTSecret = process.env.JWT_SECRET || '';

const decode = (token: any) => {
  const decodedToken: any = JWT.verify(token, JWTSecret);
  if (!token || !decodedToken.id) {
    const err: any = new Error('Invalid or missing token');
    err.statusCode = 401;
    throw err;
  }
  return decodedToken;
};

export const checkOkToStart = (token: any) => {
  const { id } = decode(token);
  if (id.includes('guest_') && !getMain()) {
    return {
      success: false,
      reason: 'No hosted games found, please create account to host a game',
    };
  }
  if (getClients()[id]) {
    return { success: false, reason: 'Session already open with this user' };
  }
  return { success: true };
};

/* eslint-disable no-underscore-dangle, no-return-assign, no-param-reassign */
export const getUser = async (token: any) => {
  const { id } = decode(token);

  if (id.includes('guest')) {
    return {
      score: 0, userId: id, username: id, token,
    };
  }

  const user = await User.findOne({ _id: id });

  const data = user
    ? {
      score: user.score,
      userId: user._id,
      username: user.username,
      token,
    }
    : null;
  return data;
};

export const updateUsername = async (token: any, data: any) => {
  const { id } = decode(token);
  if (id.includes('guest')) {
    const err: any = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
  try {
    await User.updateOne(
      { _id: id },
      { $set: { username: data.username } },
      { new: true, runValidators: true, context: 'query' },
    );
  } catch (error) {
    throw new Error('Failed to update username');
  }

  const user: any = await User.findOne({ _id: id });

  return (data = {
    score: user.score,
    userId: user._id,
    username: user.username,
    token,
  });
};
