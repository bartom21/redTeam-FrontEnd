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
import Typography from "./Typography.js";
import { loadLocationInvocies } from "../store/actions/loadLocationInvocies.js";


const getRowId = row => row.id;


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

     
export default function MonthlyInvoice(props) {
  const [columns] = useState([
    { name: 'location', title: 'Sala' },
    { name: 'month', title: 'Mes' },
    { name: 'year', title: 'Year' },
    { name: 'amount', title: 'Monto (ARS$)' }
  ]);
  const invoices = useSelector(state => state.resource.locationInvoices);
  //console.log('invoices, ',invoices)
  const [pageSize, setPageSize] = useState(0);
  const [pageSizes] = useState([5, 10, 0]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);


  const [columnWidths, setColumnWidths] = useState([
    { columnName: 'location', width: window.innerWidth/ (columns.length + 1.5) },
    { columnName: 'month', width: window.innerWidth/(columns.length + 1.5)},
    { columnName: 'year', width: window.innerWidth/(columns.length + 1.5) },
    { columnName: 'amount', width: window.innerWidth/(columns.length + 1.5)},
  ])


  const handleLoading = () => {
    setLoading(false)
  };


  const handleInvoicesToRows = () => {
    setRows(() => {
        return invoices.map((invoice) => {
            return {
                ...invoice,
                location: invoice.location.name
            }
        })
    })
  }

  useEffect(() => {
    setLoading(true)
    dispatch(loadLocationInvocies(handleLoading))
  }, []);

  useEffect(() => {
    handleInvoicesToRows()
  }, [invoices]);

  useEffect(() => {
    function handleWindowResize() {
      setColumnWidths(
        [{ columnName: 'location', width: window.innerWidth/ (columns.length + 1.5) },
        { columnName: 'month', width: window.innerWidth/(columns.length + 1.5)},
        { columnName: 'year', width: window.innerWidth/(columns.length + 1.5) },
        { columnName: 'amount', width: window.innerWidth/(columns.length + 1.5)}]     
        );}

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
    </>
  );
};