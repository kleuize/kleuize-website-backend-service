import iyzipay from "../../connections/iyzipay";

export const cancelPayment = async (data) => {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    iyzipay.cancel.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
