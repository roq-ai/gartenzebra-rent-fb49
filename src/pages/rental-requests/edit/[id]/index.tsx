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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRentalRequestById, updateRentalRequestById } from 'apiSdk/rental-requests';
import { Error } from 'components/error';
import { rentalRequestValidationSchema } from 'validationSchema/rental-requests';
import { RentalRequestInterface } from 'interfaces/rental-request';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { MachineInterface } from 'interfaces/machine';
import { getUsers } from 'apiSdk/users';
import { getMachines } from 'apiSdk/machines';

function RentalRequestEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RentalRequestInterface>(
    () => (id ? `/rental-requests/${id}` : null),
    () => getRentalRequestById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RentalRequestInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRentalRequestById(id, values);
      mutate(updated);
      resetForm();
      router.push('/rental-requests');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RentalRequestInterface>({
    initialValues: data,
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
            Edit Rental Request
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
              <Input
                type="text"
                name="dropoff_time"
                value={formik.values?.dropoff_time}
                onChange={formik.handleChange}
              />
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'rental_request',
  operation: AccessOperationEnum.UPDATE,
})(RentalRequestEditPage);
