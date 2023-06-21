import * as yup from 'yup';

export const rentalRequestValidationSchema = yup.object().shape({
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  pickup_time: yup.string().required(),
  dropoff_time: yup.string().required(),
  customer_id: yup.string().nullable(),
  machine_id: yup.string().nullable(),
});
