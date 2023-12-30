import jwt from 'jsonwebtoken'
import { DeviceInfo } from '../types';

export const generateGuestToken = (deviceInfo: DeviceInfo) => {
    const secretKey = String(process.env.GUEST_TOKEN_SECRET) 

    const { browser, deviceModel, os, osVersion, userId } = deviceInfo;

    const payload = {
        device: {
            browser,
            deviceModel,
            os,
            osVersion,
        },
        time: Date.now(),
        userId
    };

    // Generate the token with the payload and secret key
    const token = jwt.sign(payload, secretKey);
    return token;
}