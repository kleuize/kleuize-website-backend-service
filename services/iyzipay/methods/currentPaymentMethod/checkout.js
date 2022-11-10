import iyzipay from "../../connections/iyzipay";

export const initializeCheckoutPayment = async (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const getFormPayment = async (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const deleteUserCard = async (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.card.delete(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
