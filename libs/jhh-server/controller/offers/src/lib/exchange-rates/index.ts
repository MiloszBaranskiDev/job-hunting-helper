import axios from 'axios';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/domain';

const exchangeRates = async (req: any, res: any): Promise<void> => {
  try {
    const { symbol } = req.params;
    const axiosRes = await axios.get(
      `http://api.nbp.pl/api/exchangerates/rates/a/${symbol}/`
    );

    res.status(HttpStatusCode.OK).json(axiosRes.data);
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default exchangeRates;
