const express = require('express');

const authApp = express();
const authPort = 7700;

const emailApp = express();
const emailPort = 7701;

const profileApp = express();
const profilePort = 7703;

const sleep = async ({ timeInMilli }) => {
  return new Promise(resolve => setTimeout(resolve, timeInMilli));
}

// some middleware magic to simulate the wait-time for a request
const delayMiddleWare = async  (request, response, next) => {
  await sleep({ timeInMilli: 3_000 });
  next();
}

const requestLogger = async (request, response, next) => {
  console.log(`Logged Request Object: ${JSON.stringify(request.body, null, 4)}`);
  next();
}

authApp.use(express.json());
emailApp.use(express.json());
profileApp.use(express.json());

authApp.use(requestLogger);
emailApp.use(requestLogger);
profileApp.use(requestLogger);

authApp.use(delayMiddleWare);
emailApp.use(delayMiddleWare);
profileApp.use(delayMiddleWare);


// authentication endpoints
class BaseController {
  static successResponse = (response, data) => {
    return response.json({
      message: 'Success',
      success: true,
      error: null,
      statusCode: 200,
      data
    });
  };
}

class AuthController extends BaseController {
  static registerEmail = async (request, response) => {
    return AuthController.successResponse(response, { email: 'daadatobi@gmail.com' });
  };

  static loginUser = async  (request, response) => {
    const data = {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU4Mjc5N2M1LTBjNzgtNDJhZS1hNGJlLTIyZjE1NmViYjZiYyIsImVtYWlsIjoiZWJhbmtvbGVAYWlkbWwuY29tIiwiZW1haWxWZXJpZmllZCI6dHJ1ZSwidXNlcm5hbWUiOiJqYW1lc19ib25kIiwicGFzc3dvcmQiOiIkMmEkMTAkcms1VU9DdjE5cllFUnpLVHRkbmh2T0haZnpxZGw4UjZ6N01DNDhTN05IY2pHcUFRdGpLbS4iLCJmaXJzdG5hbWUiOiJKYW1lcyIsImxhc3RuYW1lIjoiQm9uZCIsImNyZWF0ZWRBdCI6IjIwMjItMDQtMjdUMTI6MDQ6MjguMjg1WiIsInVwZGF0ZWRBdCI6IjIwMjItMDQtMjdUMTI6MDY6MDQuNjgzWiIsInVzZXJJZCI6ImU4Mjc5N2M1LTBjNzgtNDJhZS1hNGJlLTIyZjE1NmViYjZiYyIsImlhdCI6MTY1MTA2MTE3MiwiZXhwIjoxNjUxMDY0NzcyfQ.ZTcf7nE5oRJRe9jmcWDg3b6tUkA4WJ6QIhMMcl2zVnM",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU4Mjc5N2M1LTBjNzgtNDJhZS1hNGJlLTIyZjE1NmViYjZiYyIsImVtYWlsIjoiZWJhbmtvbGVAYWlkbWwuY29tIiwiZW1haWxWZXJpZmllZCI6dHJ1ZSwidXNlcm5hbWUiOiJqYW1lc19ib25kIiwicGFzc3dvcmQiOiIkMmEkMTAkcms1VU9DdjE5cllFUnpLVHRkbmh2T0haZnpxZGw4UjZ6N01DNDhTN05IY2pHcUFRdGpLbS4iLCJmaXJzdG5hbWUiOiJKYW1lcyIsImxhc3RuYW1lIjoiQm9uZCIsImNyZWF0ZWRBdCI6IjIwMjItMDQtMjdUMTI6MDQ6MjguMjg1WiIsInVwZGF0ZWRBdCI6IjIwMjItMDQtMjdUMTI6MDY6MDQuNjgzWiIsInVzZXJJZCI6ImU4Mjc5N2M1LTBjNzgtNDJhZS1hNGJlLTIyZjE1NmViYjZiYyIsImlhdCI6MTY1MTA2MTE3MiwiZXhwIjoxNjUxNjY1OTcyfQ.IvI8hNt1MUgpLNH3UZtQ_14o77kWtCPtKjIR4xHBGbI"
    };

    return AuthController.successResponse(response, data);
  }

  static updateOnBoardingPassword = async (request, response) => {
    const data = {
      id: 'id',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email',
      emailVerified: true,
      username: 'tdaada'
    }

    return AuthController.successResponse(response, data);
  };
}

// email endpoints
class EmailController extends BaseController {
  static verifyCode = async (request, response) => {
    const data = {
      idToken: 'id',
      userId: 'userId',
      email: 'daadatobi@gmail.com'
    };

    return EmailController.successResponse(response, data);
  };
}

class ProfileController extends BaseController {
  static setNames = async (request, response) => {
    const data = {
      userId: 'userId',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email'
    };

    return ProfileController.successResponse(response, data);
  };

  static setUsername = async (request, response) => {
    const data = {
      userId: 'userId',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email',
      username: 'tdaada'
    };

    return ProfileController.successResponse(response, data);
  };
}

const authRouter = express.Router();
authRouter.post('/auth/register', AuthController.registerEmail);
authRouter.post('/onboarding/password', AuthController.updateOnBoardingPassword);
authRouter.post('/auth/login', AuthController.loginUser);
authApp.use('/api/v1/', authRouter);

const emailRouter = express.Router();
emailRouter.post('/verify', EmailController.verifyCode);
emailApp.use('/api/v1/email', emailRouter);

const profileRouter = express.Router();
profileRouter.post('/update', ProfileController.setNames);
profileRouter.post('/username', ProfileController.setUsername);
profileApp.use('/api/v1/onboarding', profileRouter);

authApp.listen(authPort, () => console.log(`Auth Service started. Listening on port: ${authPort}`));
emailApp.listen(emailPort, () => console.log(`Email Service started. Listerning on port: ${emailPort}`));
profileApp.listen(profilePort, () => console.log(`Profile Service Started. Listening on port: ${profilePort}`));