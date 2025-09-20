export interface PaymentCard {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PaymentInfo {
  card: PaymentCard;
  billingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  saveCard?: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}
