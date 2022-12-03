import React, {useState, useEffect  } from "react"
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import {
  PagingState,
  IntegratedPaging,
  SearchState,
  FilteringState,
  SortingState,
  IntegratedSorting,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  Toolbar,
  SearchPanel,
  TableFilterRow,
  TableColumnResizing
} from '@devexpress/dx-react-grid-material-ui';
import { Loading } from './Loading/Loading.js';
import { loadAppointments } from "../store/actions/loadAppointments";
import { loadLocations, loadTherapies } from "../store/actions/resources.js";
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link, useHistory } from "react-router-dom";
import { Avatar, Chip } from "@mui/material";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import VerticalLinearStepper from "./VerticalStepper.js";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';


const getRowId = row => row.id;

const ViewOnCalendarCell = (props) => {
  console.log('PROPS ',props)
  const history = useHistory()
    return (
    <Table.Cell {...props} style={{display: 'flex', alignContent: 'center' }}>
        <IconButton
          onClick={() => {
            history.push({
              pathname: "/calendar",
              state: {...props.row}
            })
          }}
          title="Ver en Calendario"
          size="large"
          disabled={props.disabled}
        >
          <OpenInNewIcon/>
        </IconButton>
    </Table.Cell>);
};


const Cell = (props) => {
  const { column } = props;
  if (column.name === 'link') {
    return <ViewOnCalendarCell {...props} disabled={false}/>
  }
  return (
  <Table.Cell {...props} />);
};

const FilterCell = (props) => {
  const { column } = props;
  if (column.name === 'link') {
    return <></>;
  }
  return <TableFilterRow.Cell {...props} />;
};

export default function BillGrid(props) {
  const [columns] = useState([
    { name: 'title', title: 'Titulo' },
    { name: 'therapy', title: 'Terapia' },
    { name: 'patient', title: 'Paciente/s' },
    { name: 'professional', title: 'Profesional/es' },
    { name: 'location', title: 'Ubicación' },
    { name: 'date', title: 'Fecha de inicio' },
    { name: 'isRecurrent', title: '¿Es recurrente?' },
    { name: 'link', title: 'Ver en Calendario'}
  ]);
  const [rows, setRows] = useState([]);
  const appointments = useSelector(state => state.calendar.appointments);
  const therapies = useSelector(state => state.resource.therapies);
  const locations = useSelector(state => state.resource.locations);
  const [pageSize, setPageSize] = useState(0);
  const [pageSizes] = useState([5, 10, 0]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const [columnWidths, setColumnWidths] = useState([
    { columnName: 'title', width: window.innerWidth/columns.length },
    { columnName: 'therapy', width: window.innerWidth/columns.length},
    { columnName: 'patient', width: window.innerWidth/columns.length },
    { columnName: 'professional', width: window.innerWidth/columns.length },
    { columnName: 'location', width: window.innerWidth/columns.length },
    { columnName: 'date', width: window.innerWidth/columns.length },
    { columnName: 'isRecurrent', width: window.innerWidth/columns.length },
    { columnName: 'link', width: window.innerWidth/(columns.length )}
  ])
  
  const steps = [
    'Select master blaster campaign settings',
    'Create an ad group',
    'Create an ad',
  ];

  const handleLoading = () => {
    setLoading(false)
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleAddClicked = () => {
    setOpen(true);
  };

  const handleAppointmentsToRows = () => {
    console.log('terapias ', therapies)
    console.log('locations ', locations)
    console.log('sesiones ', appointments)


    setRows(() => {
      return appointments.map((appointment) => {
      const therapy = therapies.find((therapy)=> therapy.id == appointment.therapy)
      const location = locations.find((location)=> location.id == appointment.location)
      const patients = (appointment.patients.map((item)=> item.name)).join(', ')
      const professionals = (appointment.professionals.map((item)=> item.name)).join(', ')
      return {
        ...appointment,
        therapy: therapy ? therapy.name : 'No encontrada',
        location: location ? location.name : 'No encontrada',
        patient: patients,
        professional: professionals
      }
    })
  })
    console.log('rows ', rows)
  }

  useEffect(() => {
    console.log('dispatch')
    setLoading(true)
    dispatch(loadAppointments(handleLoading))
    dispatch(loadTherapies())
    dispatch(loadLocations())
  }, []);

  useEffect(() => {
    handleAppointmentsToRows()
  }, [appointments, locations, therapies]);

  useEffect(() => {
    function handleWindowResize() {
      setColumnWidths(
        [{ columnName: 'title', width: window.innerWidth/columns.length },
        { columnName: 'therapy', width: window.innerWidth/columns.length},
        { columnName: 'patient', width: window.innerWidth/columns.length },
        { columnName: 'professional', width: window.innerWidth/columns.length },
        { columnName: 'location', width: window.innerWidth/columns.length },
        { columnName: 'date', width: window.innerWidth/columns.length },
        { columnName: 'isRecurrent', width: window.innerWidth/columns.length },
        { columnName: 'link', width: window.innerWidth/(columns.length * 2)}]);
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <>
    <Paper>
      <Grid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
      >
        <PagingState
          defaultCurrentPage={0}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <SearchState />
        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering />
        <IntegratedPaging />
        <SortingState
          defaultSorting={[]}
        />
        <IntegratedSorting />
        <Table
          cellComponent={Cell}
        />
        <TableColumnResizing
          columnWidths={columnWidths}
          onColumnWidthsChange={setColumnWidths}
        />
        <TableHeaderRow showSortingControls />
        <Toolbar />
        <PagingPanel
          pageSizes={pageSizes}
        />
        <SearchPanel />
        <TableFilterRow
          cellComponent={FilterCell}
        />
      </Grid>
      {loading && <Loading />}
    </Paper>
    <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 16, right:16}}>
        <Fab color="primary" aria-label="add" onClick={handleAddClicked}>
            <AddIcon/>
        </Fab>
    </Box>
    <Dialog open={open} onClose={handleCloseDialog}>
        <DialogContent>
            <VerticalLinearStepper></VerticalLinearStepper>
        </DialogContent>
    </Dialog>
    </>
  );
};
