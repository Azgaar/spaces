import {DeleteWriteOpResultObject} from 'mongodb';
import {Reservation} from '../models/reservation';
import {ReservationDocument, ReservationData} from '../types';
import logger from '../utils/logger';

const list = async (location: string): Promise<ReservationDocument[]> => {
  const reservations: ReservationDocument[] = await Reservation.find({location}).populate('workspace').populate('location').populate('requests');
  return reservations;
};

const add = async (reservationData: ReservationData): Promise<ReservationDocument> => {
  const reservation: ReservationDocument = await Reservation.create(reservationData);
  const reservationJSON = await reservation.populate('workspace').execPopulate();
  logger.info(`[Reservation] Reservation ${reservationJSON.id} is created`);
  return reservationJSON;
};

const check = async (reservationData: ReservationData): Promise<ReservationDocument | null> => {
  const {id, location, workspace, from, to} = reservationData;
  const reserved: ReservationDocument | null = await Reservation.findOne({_id: {$ne: id}, location, workspace, from: {$lt: to}, to: {$gt: from}});
  reserved && logger.info(`[Reservation] Workspace ${reservationData.workspace} is already reserved`);
  return reserved;
};

const update = async (reservationData: ReservationData): Promise<ReservationDocument | false> => {
  const reservation: ReservationDocument = (await Reservation.findById(reservationData.id)) as ReservationDocument;
  if (!reservation) {
    return false;
  }

  Object.assign(reservation, reservationData);
  const updatedReservation: ReservationDocument = await reservation.save();
  logger.info(`[Reservation] Reservation ${updatedReservation.id} is updated`);
  return updatedReservation;
};

const remove = async (ids: string[]): Promise<DeleteWriteOpResultObject['result']> => {
  const deletedReservations = await Reservation.deleteMany({_id: {$in: ids}});
  logger.info(`[Reservation] Reservation deletion request: ${ids.join(', ')}`);
  return deletedReservations;
};

const requestList = async (email: string, {active}: {active: boolean}): Promise<ReservationDocument[]> => {
  const timeNow = new Date();
  const toQuery = active ? {$gt: timeNow} : {$lt: timeNow};
  const reservations: ReservationDocument[] = await Reservation.find({requester: email, to: toQuery}).populate('workspace').populate('location').populate('requests');
  return reservations;
};

const requestRemoval = async (email: string, id: string): Promise<DeleteWriteOpResultObject['result']> => {
  const deletedReservation = await Reservation.deleteOne({requester: email, _id: id});
  logger.info(`[Reservation] Reservation deletion request: ${id}`);
  return deletedReservation;
};

export default {list, add, check, update, remove, requestList, requestRemoval};
