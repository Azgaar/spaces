import {Reservation} from "../models/reservation";
import {Service} from "../models/service";
import {ReservationDocument, ServiceDocument, ServiceRequestStatus} from "../types";

const list = async (status?: ServiceRequestStatus) => {
  const filter = status ? {status} : {};
  const services: ServiceDocument[] = await Service.find(filter).populate("reservation");
  return services;
};

const add = async ({reservationId, requester, servicesList}: RequestServicesReq) => {
  const servicesData = servicesList.map(description => ({reservation: reservationId, requester, description, status: ServiceRequestStatus.PENDING}));
  const services: ServiceDocument[] | null = await Service.insertMany(servicesData);
  const reservation: ReservationDocument | null = await Reservation.findOneAndUpdate({_id: reservationId}, {$push: {requests: {$each: services.map(s => s.id)}}}, {new: true, useFindAndModify: false});
  return {services, reservation};
};

const process = async (serviceIds: string[], status: ServiceRequestStatus) => {
  return await Service.updateMany({_id: {$in: serviceIds}}, {status});
};

const remove = async (serviceIds: string[]) => {
  return await Service.deleteMany({_id: {$in: serviceIds}});
};

const requestRemoval = async (id: string, requester: string) => {
  return await Service.deleteOne({_id: id, requester});
};

type RequestServicesReq = {
  reservationId: string;
  requester: string;
  servicesList: string[];
}

export default {list, add, process, remove, requestRemoval};
