import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Autocomplete, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import { loadUnpaidSessions } from '../store/actions/loadUnpaidSessions';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { addInvoice } from '../store/actions/addInvoice';
import { loadPatients } from '../store/actions/loadPatients';
import { editInvoice } from '../store/actions/editInvoice';
import { Loading } from './Loading/Loading.js';


function renderCellExpand(params) {
  return (
    <Tooltip title={params.value || ''} arrow>
      <Typography variant="body2">{params.value || ''}</Typography>
    </Tooltip>
  );
}

const columns = [
  {
    field: 'title',
    headerName: 'Titulo',
    width: 180,
    editable: false,
    sortable: false,
    renderCell: renderCellExpand,
  },
  {
    field: 'therapy',
    headerName: 'Terapia',
    type: 'string',
    width: 180,
    editable: false,
    sortable: false,
    renderCell: renderCellExpand,
  },
  {
    field: 'startDate',
    headerName: 'Fecha de inicio',
    width: 150,
    editable: false,
    sortable: false,
    renderCell: renderCellExpand,
  },
  {
    field: 'endDate',
    headerName: 'Fecha de Fin',
    type: 'date',
    width: 180,
    editable: false,
    sortable: false,
    renderCell: renderCellExpand,
  },
  {
    field: 'amount',
    headerName: 'Monto (ARS$)',
    width: 100,
    editable: false,
    sortable: false,
    renderCell: renderCellExpand,
  },
  
];




export default function VerticalLinearStepper(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [value, setValue] = useState(props.editing ? props.editedRow.patientObj : (props.patients.length > 0 ? props.patients[0] : ''));
  const unpaidSessions = useSelector(state => state.billing.unpaidSessions);
  const [selectionModel, setSelectionModel] = useState([]);
  const [invoice, setInvoice] = useState(null)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false);
  const patients = useSelector(state => state.user.patients)
  const dispatch = useDispatch()
  console.log('editedRow, ',props.editedRow)
  const handleNext = () => {
    //console.log('STEP: ',activeStep)
    if(activeStep === 0 && value){
      console.log('value ',value)
      let sessions = unpaidSessions
                          .filter((x) => x.patient===value.id)
                          .map((session) => {
                            const startDate = new Date(session.startDate).toLocaleDateString('en-GB').concat(' ', new Date(session.startDate).toLocaleTimeString());
                            const endDate = new Date(session.endDate).toLocaleDateString('en-GB').concat(' ', new Date(session.endDate).toLocaleTimeString());
                            return {
                                ...session,
                                startDate,
                                endDate
                            }
                        })
      if(props.editing && value.id === props.editedRow.patientObj.id){
        sessions = sessions.concat(props.editedRow.sessions)
        setSelectionModel(props.editedRow.sessions.map(x => x.id));
      }
      setRows(sessions)
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    if(activeStep === 1 && selectionModel.length > 0){
      //console.log('reduce ',selectionModel.map(item => item.amount).reduce((prev, next) => prev + next))
      let newSessions = []
      if(props.editing){
        newSessions = unpaidSessions.concat(props.editedRow.sessions).filter((x)=> selectionModel.includes(x.id))
      }else{
        newSessions = unpaidSessions.filter((x)=> selectionModel.includes(x.id))
      }
      setInvoice({
        date: new Date().toISOString(),
        sessions: newSessions,
        patient: value.id
      })
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    if(activeStep === 2){
      console.log('invoice: ', invoice)
      if(props.editing){
        console.log({invoice, oldInvoice: props.editedRow})
        dispatch(editInvoice({invoice, oldInvoice: props.editedRow}))
      }else{
        dispatch(addInvoice(invoice))
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleLoading = () => {
    setLoading(false)
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setValue(null)
    setRows([])
    setInvoice(null)
    setLoading(true)
    dispatch(loadUnpaidSessions(handleLoading))
  };

  useEffect(() => {
    setLoading(true)
    dispatch(loadUnpaidSessions(handleLoading))
    if(props.editing){dispatch(loadPatients())}
  }, []);

  useEffect(() => {
    console.log(value)
  }, [value]);


const unpaidSessionsGrid = (
    <Box sx={{ height: 400, width: 500 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick      
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
          console.log('Selected rows: ', newSelectionModel)
        }}
        selectionModel={selectionModel}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
);

  const selector = (
    <Box sx={{ minWidth: 120 }}>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={props.editing ? patients : props.patients}
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

  const resume = (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Monto total: {invoice ? invoice.sessions.map(item => item.amount).reduce((prev, next) => prev + next) : '0'} $
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Paciente: {value ? value.name : ''}
        </Typography>
        <Typography variant="body2">
          Se procesaron {selectionModel.length} sesiones
        </Typography>
      </CardContent>
    </Card>
  )

  const steps = [
    {
      label: 'Seleccione el Paciente',
      menu: selector
    },
    {
      label: 'Seleccione las sesiones a cobrar',
      menu: unpaidSessionsGrid
    },
    {
      label: 'Resumen',
      menu: resume
    },
  ];

  return (
    <Box sx={{ maxWidth: 700 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
            >
              {step.label}
            </StepLabel>
            <StepContent>
              {step.menu}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finalizar' : 'Continuar'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Atrás
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && !props.editing && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Cobro creado con éxito</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Crear Nuevo
          </Button>
        </Paper>
      )}
      {activeStep === steps.length && props.editing && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Cobro Editado con éxito</Typography>
          <Button onClick={props.onClose} sx={{ mt: 1, mr: 1 }}>
            Salir
          </Button>
        </Paper>
      )}
      {loading && <Loading />}
    </Box>
  );
}