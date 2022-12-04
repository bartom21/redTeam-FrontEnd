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
  RowDetailState
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  Toolbar,
  SearchPanel,
  TableFilterRow,
  TableColumnResizing,
  TableRowDetail
} from '@devexpress/dx-react-grid-material-ui';
import { Loading } from './Loading/Loading.js';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useHistory } from "react-router-dom";
import { DialogTitle } from "@mui/material";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import VerticalLinearStepper from "./VerticalStepper.js";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { loadInvocies } from "../store/actions/loadInvoices.js";
import Typography from "./Typography.js";
import { loadPatients } from "../store/actions/loadPatients.js";


const getRowId = row => row.id;

const ViewOnCalendarCell = (props) => {
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

const RowDetail = ({ row }) => {
    const [rows, setRows] = useState([]);
    const [columns] = useState([
        { name: 'title', title: 'Titulo' },
        { name: 'startDate', title: 'Fecha de inicio' },
        { name: 'endDate', title: 'Fecha de fin' },
        { name: 'amount', title: 'Monto (ARS$)' }
      ]);
    
    const handleSessionsToRows = () => {
        setRows(() => {
            return row.sessions.map((session) => {
                const startDate = new Date(session.startDate).toLocaleDateString('en-GB').concat(' ', new Date(session.startDate).toLocaleTimeString());
                const endDate = new Date(session.endDate).toLocaleDateString('en-GB').concat(' ', new Date(session.endDate).toLocaleTimeString());
                return {
                    ...session,
                    startDate,
                    endDate
                }
            })
        })
      }

      useEffect(() => {
        handleSessionsToRows()
      }, []);

    return (
        <>
        <Typography>Detalle sesiones cobradas:</Typography>
        <Paper>
            <Grid
                rows={rows}
                columns={columns}
            >
            <Table />
            <TableHeaderRow />
            </Grid>
      </Paper>
      </>
     )};

export default function BillGrid(props) {
  const [columns] = useState([
    { name: 'patient', title: 'Paciente' },
    { name: 'creationDate', title: 'Fecha de creación' },
    { name: 'amount', title: 'Monto (ARS$)' }
  ]);
  const invoices = useSelector(state => state.billing.invoices);
  //console.log('invoices, ',invoices)
  const [pageSize, setPageSize] = useState(0);
  const [pageSizes] = useState([5, 10, 0]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const patients = useSelector(state => state.user.patients);

  const [columnWidths, setColumnWidths] = useState([
    { columnName: 'patient', width: window.innerWidth/columns.length },
    { columnName: 'creationDate', width: window.innerWidth/columns.length},
    { columnName: 'amount', width: window.innerWidth/columns.length }
  ])

  const handleLoading = () => {
    setLoading(false)
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleAddClicked = () => {
    setOpen(true);
  };

  const handleInvoicesToRows = () => {
    setRows(() => {
        return invoices.map((invoice) => {
            const patient = patients.find((patient)=> patient.id === invoice.patient)
            console.log('paciente ', patient)
            const creationDate = new Date(invoice.creationDate).toLocaleDateString('en-GB').concat(' ', new Date(invoice.creationDate).toLocaleTimeString());
            return {
                ...invoice,
                patient: patient ? patient.name : '',
                creationDate
            }
        })
    })
  }

  useEffect(() => {
    setLoading(true)
    dispatch(loadPatients());
    dispatch(loadInvocies(handleLoading))
  }, []);

  useEffect(() => {
    handleInvoicesToRows()
  }, [invoices, patients]);

  useEffect(() => {
    function handleWindowResize() {
      setColumnWidths(
        [{ columnName: 'patient', width: window.innerWidth/columns.length },
        { columnName: 'creationDate', width: window.innerWidth/columns.length},
        { columnName: 'amount', width: window.innerWidth/columns.length }]);
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
        <RowDetailState
          defaultExpandedRowIds={[]}
        />
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
        <TableRowDetail
          contentComponent={RowDetail}
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
        <DialogTitle>Crear cobro a paciente</DialogTitle>
        <DialogContent>
            <VerticalLinearStepper patients={patients}></VerticalLinearStepper>
        </DialogContent>
    </Dialog>
    </>
  );
};
