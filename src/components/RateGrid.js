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
import { loadTherapies } from "../store/actions/resources.js";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { updateRate } from "../store/actions/updateRate.js";


const PREFIX = 'Demo';
const classes = {
  lookupEditCell: `${PREFIX}-lookupEditCell`,
  dialog: `${PREFIX}-dialog`,
  inputRoot: `${PREFIX}-inputRoot`,
  selectMenu: `${PREFIX}-selectMenu`,
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${classes.lookupEditCell}`]: {
    padding: theme.spacing(1),
  },
  [`& .${classes.dialog}`]: {
    width: 'calc(100% - 16px)',
  },
  [`& .${classes.inputRoot}`]: {
    width: '100%',
  },
  [`& .${classes.selectMenu}`]: {
    position: 'absolute !important',
  },
}));

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

const getRowId = row => row.id;

const Cell = (props) => {
  return (
  <Table.Cell {...props} />);
};

const EditCell = (props) => {
    return <TableEditRow.Cell {...props} />;
  };

const FilterCell = (props) => {
  return <TableFilterRow.Cell {...props} />;
};

export default function RateGrid(props) {
  const [columns] = useState([
    { name: 'name', title: 'Terapia' },
    { name: 'rate', title: 'Precio ($/hs)' }
  ]);
  const therapies = useSelector(state => state.resource.therapies);
  const [pageSize, setPageSize] = useState(0);
  const [pageSizes] = useState([5, 10, 0]);
  const dispatch = useDispatch();
  const [editingStateColumnExtensions] = useState([
    { columnName: 'name', editingEnabled: false }
  ]);

  const [columnWidths, setColumnWidths] = useState([
    { columnName: 'name', width: window.innerWidth/columns.length},
    { columnName: 'rate', width: window.innerWidth/columns.length }
  ])

  console.log('terapias, ',therapies)

  const commitChanges = (action) => {
    console.log(action)
    if(action.changed){
        console.log('q',Object.values(action.changed)[0])
       if(Object.values(action.changed)[0]){
            const id = Object.keys(action.changed)[0];
            const rate = Object.values(action.changed)[0].rate;
            const therapy = {
                id,
                rate
            }
            console.log('changed, ', therapy)
            dispatch(updateRate(therapy))
        }
    }
    //setRows(changedRows);
  };

  useEffect(() => {
    dispatch(loadTherapies())
  }, []);

  useEffect(() => {
    function handleWindowResize() {
      setColumnWidths(
        [
            { columnName: 'name', width: window.innerWidth/columns.length},
            { columnName: 'rate', width: window.innerWidth/columns.length }
        ]);
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <Paper>
      <Grid
        rows={therapies}
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
    </Paper>
  );
};
