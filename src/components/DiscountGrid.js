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
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  PagingPanel,
  Toolbar,
  SearchPanel,
  TableFilterRow,
  TableColumnResizing
} from '@devexpress/dx-react-grid-material-ui';
import { loadPatients } from "../store/actions/loadPatients.js";
import { loadDiscounts } from "../store/actions/loadDiscounts.js";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Loading } from './Loading/Loading.js';
import { editRole } from "../store/actions/editRole";import { editDiscount } from "../store/actions/editDiscount.js";
;


const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      onClick={onExecute}
      title="Create new row"
    >
      New
    </Button>
  </div>
);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row" size="large">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Are you sure you want to delete this row?')) {
        onExecute();
      }
    }}
    title="Delete row"
    size="large"
  >
    <DeleteIcon />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes" size="large">
    <SaveIcon />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes" size="large">
    <CancelIcon />
  </IconButton>
);

const commandComponents = {
  add: AddButton,
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
  return <Table.Cell {...props} />;
};

const FilterCell = (props) => {
  return <TableFilterRow.Cell {...props} />;
};


const getRowId = row => row.id;

export default function DiscountGrid(props) {
  const [columns] = useState([
    { name: 'name', title: 'Nombre' },
    { name: 'discount', title: 'Descuento sobre tarifa (%)' },
  ]);
  const [rows, setRows] = useState([]);
  const patients = useSelector(state => state.user.patients);
  const discounts = useSelector(state => state.billing.discounts);
  const [editingStateColumnExtensions] = useState([
    { columnName: 'name', editingEnabled: false },
  ]);
  const [pageSize, setPageSize] = useState(0);
  const [pageSizes] = useState([5, 10, 0]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const commitChanges = (action) => {
    console.log(action)
    if(action.changed){
        if(Object.values(action.changed)[0].discount){
            console.log('dispatch')
            
            setLoading(true)
            dispatch(editDiscount(action, handleLoading))
        }
    }
    //setRows(changedRows);
  };

  const handleLoading = () => {
    setLoading(false)
  };

  const handleDiscountsToRows = () => {
    setRows(() => {
        return patients.map((patient) => { 
            const discount = discounts.find(x => x.patient === patient.id)
            return {
                name: patient ? patient.name : '',
                discount: discount ? discount.rate : 0,
                id: patient ? patient.id : new Date().getMilliseconds()
            }
        })
    })
  }

  useEffect(() => {
    handleDiscountsToRows()
    console.log(discounts)
  }, [patients, discounts]);

  useEffect(() => {
    setLoading(true)
    dispatch(loadDiscounts())
    dispatch(loadPatients(handleLoading))
  }, []);

  const [columnWidths, setColumnWidths] = useState([
    { columnName: 'name', width: window.innerWidth/(columns.length + 1.5)},
    { columnName: 'discount', width: window.innerWidth/(columns.length + 1.5) }
  ])

  /*useEffect(() => {
    setRows(data);
    console.log('setRows')
    setLoading(false)
  }, [data]);*/

  useEffect(() => {
    function handleWindowResize() {
      setColumnWidths([
        { columnName: 'name', width: window.innerWidth/(columns.length + 1.5)},
        { columnName: 'discount', width: window.innerWidth/(columns.length + 1.5) }]);
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <Paper>
      <Grid
        rows={rows}
        locale='es-ES'
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
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
