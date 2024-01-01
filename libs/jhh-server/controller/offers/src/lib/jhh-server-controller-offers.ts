import addOffer from './add-offer';
import editOffer from './edit-offer';
import removeOffer from './remove-offer';

export function JhhServerControllerOffers() {
  return {
    addOffer,
    editOffer,
    removeOffer,
  };
}
