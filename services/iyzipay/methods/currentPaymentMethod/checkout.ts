import iyzipay from "../../connections/iyzipay";

export const initializeCheckoutPayment = async (data: any) => {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    iyzipay.checkoutFormInitialize.create(data, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const getFormPayment = async (data: any) => {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    iyzipay.checkoutForm.retrieve(data, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const deleteUserCard = async (data: any) => {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    iyzipay.card.delete(data, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
