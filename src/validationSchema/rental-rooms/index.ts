import * as yup from 'yup';

export const rentalRoomValidationSchema = yup.object().shape({
  name: yup.string().required(),
  rental_request_id: yup.string().nullable(),
});
