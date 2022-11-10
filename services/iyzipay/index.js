import Iyzipay from "iyzipay";
import { nanoid } from "nanoid";
import * as Cards from "./methods/cards.js";
import * as Installment from "./methods/installment.js";
import * as Payments from "./methods/payment.js";
import * as ThreeDs from "./methods/threeds-payments.js";

{/* -------------Cards--------------*/}

//create user and card
const createUserAndCard = () => {
  Cards.createUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    email: "email@email.com",
    externalId: nanoid(),
    card: {
      cardAlias: "Saklı karta verilen isim",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0",
    },
  })
    .then((results) => {
      console.log(results, "1 id'li kullanıcı için kart oluştur");
    })
    .catch((err) => {
      console.log(err, "ERROR, 1 id'li kullanıcı için kart oluştur");
    });
};

// createUserAndCard();

// create new card for existing user
const createNewCardForExistingUser = () => {
  Cards.createUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    email: "email@email.com",
    externalId: nanoid(),
    cardUserKey: 'JAg6HK5bVwJn/qkou3LpMiBTliI=',
    card: {
      cardAlias: "Saklı karta verilen isim1",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0",
    },
  })
    .then((results) => {
      console.log(results, "1 id'li kullanıcı için kart ekle");
    })
    .catch((err) => {
      console.log(err, "ERROR, 1 id'li kullanıcı için kart ekle");
    });
};

// createNewCardForExistingUser();

// read card for a user 

const readCardForExistingUser = () => {
    Cards.getUserCard({
      locale: Iyzipay.LOCALE.TR,
      conversationId: nanoid(),
      email: "email@email.com",
      externalId: nanoid(),
      cardUserKey: 'JAg6HK5bVwJn/qkou3LpMiBTliI=',
      card: {
        cardAlias: "Saklı karta verilen isim1",
        cardHolderName: "John Doe",
        cardNumber: "5528790000000008",
        expireMonth: "12",
        expireYear: "2030",
        cvc: "123",
        registerCard: "0",
      },
    })
      .then((results) => {
        console.log(results, "1 id'li kullanıcı için kartını oku");
      })
      .catch((err) => {
        console.log(err, "ERROR, 1 id'li kullanıcı için kartını");
      });
  };

//   readCardForExistingUser();

// delete a user's cards

const deleteAUsersCards = () => {
    Cards.deleteUserCard({
      locale: Iyzipay.LOCALE.TR,
      conversationId: nanoid(),
      email: "email@email.com",
      externalId: nanoid(),
      cardUserKey: 'JAg6HK5bVwJn/qkou3LpMiBTliI=',
      cardToken: 'Be06xfClO3bEjFOZdaNllaSBnUk=',
      card: {
        cardAlias: "Saklı karta verilen isim1",
        cardHolderName: "John Doe",
        cardNumber: "5528790000000008",
        expireMonth: "12",
        expireYear: "2030",
        cvc: "123",
        registerCard: "0",
      },
    })
      .then((results) => {
        console.log(results, "1 id'li kullanıcı için kartını si");
      })
      .catch((err) => {
        console.log(err, "ERROR, 1 id'li kullanıcı için kartını sil");
      });
  };

//   deleteAUsersCards();



{/* -------------Installment--------------*/}


const checkInstallments = () => {
    Installment.checkInstallment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        binNumber: '554960',
        price: '100'
    })
      .then((results) => {
        console.log(results, "checkInstallment");
      })
      .catch((err) => {
        console.log(err, "ERROR, checkInstallment");
      });
  };

//   checkInstallments();

{/* -------------Normal-Payment--------------*/}

// payment and registration with an unregistered card


const createPayment = () => {
    Payments.createPayment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        price: '1',
        paidPrice: '1.2',
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        basketId: 'B67832',
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: {
            cardHolderName: 'John Doe',
            cardNumber: '5528790000000008',
            expireMonth: '12',
            expireYear: '2030',
            cvc: '123',
            registerCard: '0'
        },
        buyer: {
            id: 'BY789',
            name: 'John',
            surname: 'Doe',
            gsmNumber: '+905350000000',
            email: 'email@email.com',
            identityNumber: '74300864791',
            lastLoginDate: '2015-10-05 12:43:35',
            registrationDate: '2013-04-21 15:12:09',
            registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            ip: '85.34.78.112',
            city: 'Istanbul',
            country: 'Turkey',
            zipCode: '34732'
        },
        shippingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        },
        billingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        },
        basketItems: [
            {
                id: 'BI101',
                name: 'Binocular',
                category1: 'Collectibles',
                category2: 'Accessories',
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: '0.3'
            },
            {
                id: 'BI102',
                name: 'Game code',
                category1: 'Game',
                category2: 'Online Game Items',
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: '0.5'
            },
            {
                id: 'BI103',
                name: 'Usb',
                category1: 'Electronics',
                category2: 'Usb / Cable',
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: '0.2'
            }
        ]
    })
      .then((results) => {
        console.log(results, "yeni bir kartla ödeme al ve kartı kaydetme");
      })
      .catch((err) => {
        console.log(err, "yeni bir kartla ödeme al ve kartı kaydetme");
      });
  };


//   createPayment();

const createPaymentAndSave = () => {
    Payments.createPayment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        price: '1',
        paidPrice: '1.2',
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        basketId: 'B67832',
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: {
            cardToken: 'dhrYq4/NOEAiNdsABx9Lwfm0iC0=',
            cardUserKey: 'JAg6HK5bVwJn/qkou3LpMiBTliI=',
            cardAlias: "Kendi Kartım",
            cardHolderName: 'John Doe',
            cardNumber: '5528790000000008',
            expireMonth: '12',
            expireYear: '2030',
            cvc: '123',
            registerCard: '0'
        },
        buyer: {
            id: 'BY789',
            name: 'John',
            surname: 'Doe',
            gsmNumber: '+905350000000',
            email: 'email@email.com',
            identityNumber: '74300864791',
            lastLoginDate: '2015-10-05 12:43:35',
            registrationDate: '2013-04-21 15:12:09',
            registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            ip: '85.34.78.112',
            city: 'Istanbul',
            country: 'Turkey',
            zipCode: '34732'
        },
        shippingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        },
        billingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        },
        basketItems: [
            {
                id: 'BI101',
                name: 'Binocular',
                category1: 'Collectibles',
                category2: 'Accessories',
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: '0.3'
            },
            {
                id: 'BI102',
                name: 'Game code',
                category1: 'Game',
                category2: 'Online Game Items',
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: '0.5'
            },
            {
                id: 'BI103',
                name: 'Usb',
                category1: 'Electronics',
                category2: 'Usb / Cable',
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: '0.2'
            }
        ]
    })
      .then((results) => {
        console.log(results, "yeni bir kartla ödeme al ve kartı kaydet");
      })
      .catch((err) => {
        console.log(err, "yeni bir kartla ödeme al ve kartı kaydet");
      });
  };

  createPaymentAndSave();
//   readCardForExistingUser();
