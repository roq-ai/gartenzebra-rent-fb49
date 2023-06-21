import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { machineValidationSchema } from 'validationSchema/machines';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getMachines();
    case 'POST':
      return createMachine();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMachines() {
    const data = await prisma.machine
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'machine'));
    return res.status(200).json(data);
  }

  async function createMachine() {
    await machineValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.rental_request?.length > 0) {
      const create_rental_request = body.rental_request;
      body.rental_request = {
        create: create_rental_request,
      };
    } else {
      delete body.rental_request;
    }
    const data = await prisma.machine.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
