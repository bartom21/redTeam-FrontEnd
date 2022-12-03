import * as React from 'react';
import Box from '@mui/material/Box';
import { loadPatients } from '../store/actions/loadPatients';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';

export default function PatientsSelector() {
    const patients = useSelector(state => state.user.patients);
    const [value, setValue] = useState(patients.length > 0 ? patients[0] : '');
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadPatients());
      }, []);

      useEffect(() => {
        console.log(value)
      }, [value]);

  return (
    <Box sx={{ minWidth: 120 }}>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={patients}
        fullWidth
        sx={{mt:1}}
        value={value}
        onChange={(event, newValue) => {
            setValue(newValue);
        }}
        getOptionLabel={(option) => option.name || ''}
        isOptionEqualToValue ={(option, value) => option.id === value.id}
        renderInput={(params) => <TextField {...params} label="Paciente" />}
      />
    </Box>
  );
}