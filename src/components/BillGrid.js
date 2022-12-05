import React, {useState, useEffect  } from "react"
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import {
    EditingState,
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
    Plugin, Template, TemplateConnector, TemplatePlaceholder,
  } from '@devexpress/dx-react-core';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableEditRow,
  TableEditColumn,
  Toolbar,
  SearchPanel,
  TableFilterRow,
  TableColumnResizing,
  TableRowDetail
} from '@devexpress/dx-react-grid-material-ui';
import { Loading } from './Loading/Loading.js';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
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
import { deleteInvoice } from "../store/actions/deleteInvoice.js";

const getRowId = row => row.id;

const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Editar cobro" size="large">
      <EditIcon />
    </IconButton>
  );
  
  const DeleteButton = ({ onExecute }) => (
    <IconButton
      onClick={() => {
        // eslint-disable-next-line
        if (window.confirm('¿Está seguro que desea eliminar el cobro?')) {
          onExecute();
        }
      }}
      title="Eliminar cobro"
      size="large"
    >
      <DeleteIcon />
    </IconButton>
  );
  
  const CommitButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Guardar los cambios" size="large">
      <SaveIcon />
    </IconButton>
  );
  
  const CancelButton = ({ onExecute }) => (
    <IconButton color="secondary" onClick={onExecute} title="Cancelar los cambios" size="large">
      <CancelIcon />
    </IconButton>
  );

  const commandComponents = {
    edit: EditButton,
    delete: DeleteButton,
    commit: CommitButton,
    cancel: CancelButton,
  };
  
  const Command = ({ id, onExecute }) => {
    const CommandButton = commandComponents[id];
    return (
      <CommandButton
        onExecute={onExecute}
      />
    );
  };

const EditCell = (props) => {
    return <TableEditRow.Cell {...props} />;
  };

const Cell = (props) => {
  return (
  <Table.Cell {...props} />);
};

const FilterCell = (props) => {
  return <TableFilterRow.Cell {...props} />;
};

const RowDetail = ({ row }) => {
    const [rows, setRows] = useState([]);
    const [columns] = useState([
        { name: 'title', title: 'Titulo' },
        { name: 'therapy', title: 'Terapia' },
        { name: 'startDate', title: 'Fecha de inicio' },
        { name: 'endDate', title: 'Fecha de fin' },
        { name: 'amount', title: 'Monto (ARS$)' }
      ]);
      const [columnWidths, setColumnWidths] = useState(
        [{ columnName: 'title', width: window.innerWidth/(columns.length) },
        { columnName: 'therapy', width: window.innerWidth/(columns.length )},
        { columnName: 'startDate', width: window.innerWidth/(columns.length)},
        { columnName: 'endDate', width: window.innerWidth/(columns.length)},
        { columnName: 'amount', width: window.innerWidth/(columns.length)}
      ])
    
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
        function handleWindowResize() {
          setColumnWidths(
            [{ columnName: 'title', width: window.innerWidth/(columns.length) },
            { columnName: 'therapy', width: window.innerWidth/(columns.length )},
            { columnName: 'startDate', width: window.innerWidth/(columns.length)},
            { columnName: 'endDate', width: window.innerWidth/(columns.length)},
            { columnName: 'amount', width: window.innerWidth/(columns.length)}
        ]);
        }
    
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }, []);

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
            <TableColumnResizing
                columnWidths={columnWidths}
                onColumnWidthsChange={setColumnWidths}
            />
            <TableHeaderRow />
            </Grid>
      </Paper>
      </>
     )};

     const Popup = ({
        row,
        onChange,
        onApplyChanges,
        onCancelChanges,
        open,
      }) => (
        <Dialog open={open} onClose={onCancelChanges}>
        <DialogTitle>Editar cobro a paciente</DialogTitle>
        <DialogContent>
            <VerticalLinearStepper patients={[]} editing={true} editedRow={row} onClose={onCancelChanges}></VerticalLinearStepper>
        </DialogContent>
    </Dialog>
      );

     const PopupEditing = React.memo(({ popupComponent: Popup }) => (
        <Plugin>
          <Template name="popupEditing">
            <TemplateConnector>
              {(
                {
                  rows,
                  getRowId,
                  addedRows,
                  editingRowIds,
                  createRowChange,
                  rowChanges,
                },
                {
                  changeRow, changeAddedRow, commitChangedRows, commitAddedRows,
                  stopEditRows, cancelAddedRows, cancelChangedRows,
                },
              ) => {
                const isNew = addedRows.length > 0;
                let editedRow;
                let rowId;
                if (isNew) {
                  rowId = 0;
                  editedRow = addedRows[rowId];
                } else {
                  [rowId] = editingRowIds;
                  const targetRow = rows.filter(row => getRowId(row) === rowId)[0];
                  editedRow = { ...targetRow, ...rowChanges[rowId] };
                }
      
                const processValueChange = ({ target: { name, value } }) => {
                  const changeArgs = {
                    rowId,
                    change: createRowChange(editedRow, value, name),
                  };
                  if (isNew) {
                    changeAddedRow(changeArgs);
                  } else {
                    changeRow(changeArgs);
                  }
                };
                const rowIds = isNew ? [0] : editingRowIds;
                const applyChanges = () => {
                  if (isNew) {
                    commitAddedRows({ rowIds });
                  } else {
                    stopEditRows({ rowIds });
                    commitChangedRows({ rowIds });
                  }
                };
                const cancelChanges = () => {
                  if (isNew) {
                    cancelAddedRows({ rowIds });
                  } else {
                    stopEditRows({ rowIds });
                    cancelChangedRows({ rowIds });
                  }
                };
      
                const open = editingRowIds.length > 0 || isNew;
                return (
                  <Popup
                    open={open}
                    row={editedRow}
                    onChange={processValueChange}
                    onApplyChanges={applyChanges}
                    onCancelChanges={cancelChanges}
                  />
                );
              }}
            </TemplateConnector>
          </Template>
          <Template name="root">
            <TemplatePlaceholder />
            <TemplatePlaceholder name="popupEditing" />
          </Template>
        </Plugin>
      ));

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
    { columnName: 'patient', width: window.innerWidth/ (columns.length + 1.5) },
    { columnName: 'creationDate', width: window.innerWidth/(columns.length + 1.5)},
    { columnName: 'amount', width: window.innerWidth/(columns.length + 1.5) }
  ])

  const [editingStateColumnExtensions] = useState([
    { columnName: 'patient', editingEnabled: false },
    { columnName: 'creationDate', editingEnabled: false },
    { columnName: 'amount', editingEnabled: false }
  ]);

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
                patientObj: patient ? patient : {},
                patient: patient ? patient.name : '',
                creationDate,
                date: invoice.creationDate
            }
        })
    })
  }

  const commitChanges = (action) => {
    console.log(action)
    if(action.changed){
        /*if(Object.values(action.changed)[0].role){
            console.log('dispatch')
            setLoading(true)
            dispatch(editRole(action, handleLoading))
        }*/
    }
    if(action.deleted){
        console.log('DELETED')
        setLoading(true)
        dispatch(deleteInvoice(action, handleLoading))
    }
    //setRows(changedRows);
  };

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
        [{ columnName: 'patient', width: window.innerWidth/(columns.length + 1.5) },
        { columnName: 'creationDate', width: window.innerWidth/(columns.length + 1.5)},
        { columnName: 'amount', width: window.innerWidth/(columns.length + 1.5)}]);
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
        <EditingState
          onCommitChanges={commitChanges}
          columnExtensions={editingStateColumnExtensions}
        />
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
        <TableEditRow
          cellComponent={EditCell}
        />
        <TableEditColumn
            showEditCommand
            showDeleteCommand
            commandComponent={Command}
        />
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
        <PopupEditing popupComponent={Popup} />
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
            <VerticalLinearStepper patients={patients} editing={false}></VerticalLinearStepper>
        </DialogContent>
    </Dialog>
    </>
  );
};
