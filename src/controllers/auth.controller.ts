import {
  guestLogin,
  login,
  signup,
  requestPasswordReset,
  resetPassword,
} from '../services/auth.service';

export const guestLoginController = async (req: any, res: any, next: any) => {
  const loginService = await guestLogin();
  return res.json(loginService);
};

export const loginController = async (req: any, res: any, next: any) => {
  const loginService = await login(req.body);
  return res.json(loginService);
};

export const signUpController = async (req: any, res: any, next: any) => {
  const signupService = await signup(req.body);
  return res.json(signupService);
};

export const resetPasswordRequestController = async (req: any, res: any, next: any) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.username,
  );
  return res.json(requestPasswordResetService);
};

export const resetPasswordController = async (req: any, res: any, next: any) => {
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password,
  );
  return res.json(resetPasswordService);
};
