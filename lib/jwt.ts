import { config } from "@/config";
import jwt from "jsonwebtoken";

import { SignOptions } from "jsonwebtoken";

export function signJWT(payload: object, expiresIn: string = "100y") {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.jwtSecret, options);
}

export function verifyJWT(token: string) {
  return jwt.verify(token, config.jwtSecret);
}
