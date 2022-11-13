import { Request, Response } from "express";
//@ts-ignore
import * as Checkout from "../services/iyzipay/methods/currentPaymentMethod/checkout.js";
//@ts-ignore
import Iyzipay from "iyzipay";
import { nanoid } from "nanoid";

export const chechoutInitialize = async (req: Request, res: Response) => {
  const { price } = req.body;
  const paidPrice = price * 1.2;
  let result = await Checkout.initializeCheckoutPayment({
    locale: "tr",
    price: price,
    paidPrice: paidPrice,
    currency: "TRY",
    callbackUrl: "https://localhost/api/checkout/complete/payment",
    enabledInstallments: [1],
    buyer: {
      id: "BY789",
      name: "John",
      surname: "Doe",
      email: "email@email.com",
      identityNumber: "74300864791",
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
    },
    billingAddress: {
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
    },
    basketItems: [
      {
        id: "BI101",
        name: "Binocular",
        category1: "Collectibles",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: "21",
      },
    ],
  });
  res.json(result);
  const html = `<!DOCTYPE html>
  <html>
  <head>
  <title>Ödeme Yap</title>
  <meta charset="UTF-8" />
  ${result?.checkoutFormContent}
  </head>
  </html>`;
};

export const chechoutController = async (req: Request, res: Response) => {
  let result = await Checkout.getFormPayment({
    locale: "tr",
    converSationId: nanoid(),
    token: req.body.token,
  });
  res.json(result);
};
