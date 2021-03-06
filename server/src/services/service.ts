import {DeleteWriteOpResultObject} from 'mongodb';
import {UpdateWriteOpResult} from 'mongoose';
import {Reservation} from '../models/reservation';
import {Service} from '../models/service';
import {ReservationDocument, ServiceData, ServiceDocument, ServiceRequestStatus} from '../types';

const list = async (location: string, status: ServiceRequestStatus): Promise<ServiceDocument[]> => {
  const services: ServiceDocument[] = await Service.find({location, status}).populate({path: 'reservation', model: 'Reservation', populate: 'workspace'});
  return services;
};

const add = async ({location, reservationId, requester, servicesList}: ServiceData): Promise<{services: ServiceDocument[] | null; reservation: ReservationDocument | null}> => {
  const servicesData = servicesList.map((description) => ({location, reservation: reservationId, requester, description, status: ServiceRequestStatus.PENDING}));
  const services: ServiceDocument[] | null = await Service.insertMany(servicesData);
  const reservation: ReservationDocument | null = await Reservation.findOneAndUpdate(
    {_id: reservationId},
    {$push: {requests: {$each: services.map((s) => s.id)}}},
    {new: true, useFindAndModify: false}
  );
  return {services, reservation};
};

const process = async (serviceIds: string[], status: ServiceRequestStatus): Promise<UpdateWriteOpResult> => {
  return await Service.updateMany({_id: {$in: serviceIds}}, {status});
};

const remove = async (serviceIds: string[]): Promise<DeleteWriteOpResultObject['result']> => {
  return await Service.deleteMany({_id: {$in: serviceIds}});
};

const requestRemoval = async (id: string, requester: string): Promise<DeleteWriteOpResultObject['result']> => {
  return await Service.deleteOne({_id: id, requester});
};

export default {list, add, process, remove, requestRemoval};
