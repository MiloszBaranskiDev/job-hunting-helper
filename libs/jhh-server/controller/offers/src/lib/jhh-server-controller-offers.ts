import addOffer from './add-offer';
import editOffer from './edit-offer';
import removeOffers from './remove-offers';
import exchangeRates from './exchange-rates';

export function JhhServerControllerOffers() {
  return {
    addOffer,
    editOffer,
    removeOffers,
    exchangeRates,
  };
}
