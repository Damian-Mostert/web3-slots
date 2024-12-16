import { NextApiRequest, NextApiResponse } from "next";

const verifyCaptcha = async (captchaValue: string) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY!;
  
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: secretKey,
      response: captchaValue,
    }),
  });

  const data = await response.json();
  return data.success;
};

export default verifyCaptcha;