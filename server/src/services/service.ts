import {Reservation} from "../models/reservation";
import {Service} from "../models/service";
import {ReservationDocument, ServiceData, ServiceDocument, ServiceRequestStatus} from "../types";
import logger from "../utils/logger";

const list = async (location: string) => {
  const reservations: ServiceDocument[] = await Service.find({location}).populate("workspace");
  return reservations;
};

type RequestServicesReq = {
  reservationId: string;
  requester: string;
  servicesList: string[];
}

const add = async ({reservationId, requester, servicesList}: RequestServicesReq) => {
  const servicesData = servicesList.map(description => ({reservation: reservationId, requester, description, status: ServiceRequestStatus.PENDING}));
  const services: ServiceDocument[] | null = await Service.insertMany(servicesData);
  const reservation: ReservationDocument | null = await Reservation.findOneAndUpdate({_id: reservationId}, {$push: {requests: {$each: services.map(s => s.id)}}}, {new: true, useFindAndModify: false});
  return {services, reservation};
};

const update = async (reservationData: ServiceData) => {
  const reservation: ServiceDocument = await Service.findById(reservationData.id) as ServiceDocument;
  if (!reservation) return false;

  Object.assign(reservation, reservationData);
  const updatedService: ServiceDocument = await reservation.save();
  logger.info(`[Service] Service ${updatedService.id} is updated`);
  return updatedService;
};

const remove = async (ids: Array<string>) => {
  const deletedServices = await Service.deleteMany({_id: {$in: ids}});
  logger.info(`[Service] Service deletion request: ${ids.join(", ")}`);
  return deletedServices;
};

export default {list, add, update, remove};
