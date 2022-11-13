import iyzipay from "../../connections/iyzipay";

export const refundPayment = async (data: any) => {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    iyzipay.refund.create(data, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
