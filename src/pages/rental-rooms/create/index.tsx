import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createRentalRoom } from 'apiSdk/rental-rooms';
import { Error } from 'components/error';
import { rentalRoomValidationSchema } from 'validationSchema/rental-rooms';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RentalRequestInterface } from 'interfaces/rental-request';
import { getRentalRequests } from 'apiSdk/rental-requests';
import { RentalRoomInterface } from 'interfaces/rental-room';

function RentalRoomCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RentalRoomInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRentalRoom(values);
      resetForm();
      router.push('/rental-rooms');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RentalRoomInterface>({
    initialValues: {
      name: '',
      rental_request_id: (router.query.rental_request_id as string) ?? null,
    },
    validationSchema: rentalRoomValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Rental Room
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<RentalRequestInterface>
            formik={formik}
            name={'rental_request_id'}
            label={'Select Rental Request'}
            placeholder={'Select Rental Request'}
            fetcher={getRentalRequests}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.pickup_time}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'rental_room',
  operation: AccessOperationEnum.CREATE,
})(RentalRoomCreatePage);
