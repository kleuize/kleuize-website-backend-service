import iyzipay from "../../connections/iyzipay";

export const refundPayment = async (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.refund.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
