import iyzipay from "../../connections/iyzipay";

export const initializeCheckoutPayment = async (data: any) => {
  return new Promise((resolve, reject) => {
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
    iyzipay.card.delete(data, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
