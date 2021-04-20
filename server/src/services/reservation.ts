import {Reservation} from "../models/reservation";
import {ReservationDocument, ReservationData} from "../types";
import logger from "../utils/logger";

const list = async (location: string) => {
  const reservations: ReservationDocument[] = await Reservation.find({location}).populate("workspace");
  return reservations;
};

const add = async (reservationData: ReservationData) => {
  const reservation: ReservationDocument = await Reservation.create(reservationData);
  const reservationJSON = await reservation.populate("workspace").execPopulate();
  logger.info(`[Reservation] Reservation ${reservationJSON.id} is created`);
  return reservationJSON;
};

const update = async (reservationData: ReservationData) => {
  const reservation: ReservationDocument = await Reservation.findById(reservationData.id) as ReservationDocument;
  if (!reservation) return false;

  Object.assign(reservation, reservationData);
  const updatedReservation: ReservationDocument = await reservation.save();
  logger.info(`[Reservation] Reservation ${updatedReservation.id} is updated`);
  return updatedReservation;
};

const remove = async (ids: Array<string>) => {
  const deletedReservations = await Reservation.deleteMany({_id: {$in: ids}});
  logger.info(`[Reservation] Reservation deletion request: ${ids.join(", ")}`);
  return deletedReservations;
};

const requestList = async (email: string, {active}: {active: boolean}) => {
  const timeNow = new Date();
  const toQuery = active ? {$gt: timeNow} : {$lt: timeNow};
  const reservations: ReservationDocument[] = await Reservation.find({requester: email, to: toQuery}).populate("workspace").populate("location");
  return reservations;
};

const requestRemoval = async (email: string, id: string) => {
  const deletedReservation = await Reservation.deleteOne({requester: email, _id: id});
  logger.info(`[Reservation] Reservation deletion request: ${id}`);
  return deletedReservation;
};

export default {list, add, update, remove, requestList, requestRemoval};
