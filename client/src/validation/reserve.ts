import * as yup from 'yup';
import {getMaxDate} from '../utils';

export const reserveValidationSchema = yup.object({
  location: yup.object().shape({
    id: yup.string().required('Location is required')
  }),
  from: yup.date().min(new Date(), 'Date must be in the future'),
  to: yup.date().min(yup.ref('from'), 'End time must be later than start time').max(getMaxDate(), 'The date is too late'),
  size: yup.number().min(1).max(255).integer()
});
