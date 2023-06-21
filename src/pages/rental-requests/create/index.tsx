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
import { createRentalRequest } from 'apiSdk/rental-requests';
import { Error } from 'components/error';
import { rentalRequestValidationSchema } from 'validationSchema/rental-requests';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { MachineInterface } from 'interfaces/machine';
import { getUsers } from 'apiSdk/users';
import { getMachines } from 'apiSdk/machines';
import { RentalRequestInterface } from 'interfaces/rental-request';

function RentalRequestCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RentalRequestInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRentalRequest(values);
      resetForm();
      router.push('/rental-requests');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RentalRequestInterface>({
    initialValues: {
      start_date: new Date(new Date().toDateString()),
      end_date: new Date(new Date().toDateString()),
      pickup_time: '',
      dropoff_time: '',
      customer_id: (router.query.customer_id as string) ?? null,
      machine_id: (router.query.machine_id as string) ?? null,
    },
    validationSchema: rentalRequestValidationSchema,
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
            Create Rental Request
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="start_date" mb="4">
            <FormLabel>Start Date</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.start_date ? new Date(formik.values?.start_date) : null}
                onChange={(value: Date) => formik.setFieldValue('start_date', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <FormControl id="end_date" mb="4">
            <FormLabel>End Date</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.end_date ? new Date(formik.values?.end_date) : null}
                onChange={(value: Date) => formik.setFieldValue('end_date', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <FormControl id="pickup_time" mb="4" isInvalid={!!formik.errors?.pickup_time}>
            <FormLabel>Pickup Time</FormLabel>
            <Input type="text" name="pickup_time" value={formik.values?.pickup_time} onChange={formik.handleChange} />
            {formik.errors.pickup_time && <FormErrorMessage>{formik.errors?.pickup_time}</FormErrorMessage>}
          </FormControl>
          <FormControl id="dropoff_time" mb="4" isInvalid={!!formik.errors?.dropoff_time}>
            <FormLabel>Dropoff Time</FormLabel>
            <Input type="text" name="dropoff_time" value={formik.values?.dropoff_time} onChange={formik.handleChange} />
            {formik.errors.dropoff_time && <FormErrorMessage>{formik.errors?.dropoff_time}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'customer_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<MachineInterface>
            formik={formik}
            name={'machine_id'}
            label={'Select Machine'}
            placeholder={'Select Machine'}
            fetcher={getMachines}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
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
  entity: 'rental_request',
  operation: AccessOperationEnum.CREATE,
})(RentalRequestCreatePage);
