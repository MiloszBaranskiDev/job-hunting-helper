import { Offer, PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/enums';

import { JhhServerDb } from '@jhh/jhh-server/db';

const removeOffer = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { offerId } = req.query;
    const userId = req.user.id;

    if (!offerId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Offer ID is required.'
      );
    }

    const offer: Offer | null = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return respondWithError(res, HttpStatusCode.NotFound, 'Offer not found');
    }

    if (offer.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the offer'
      );
    }

    const removedOffer: Offer = await prisma.offer.delete({
      where: { id: offerId },
    });

    res.status(HttpStatusCode.OK).json({ data: { removedOffer } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default removeOffer;
