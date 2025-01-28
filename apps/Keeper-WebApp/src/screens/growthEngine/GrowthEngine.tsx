import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Button, TableHead } from '@mui/material';
import { AppBoldText, KeeperTextInput, LoadingSpinner } from 'components';
import { useEffect, useState } from 'react';
import { MiscService } from 'services';
import { TGrowthEngineEntry } from 'types/globalTypes';
import toast from 'react-hot-toast';

import useStyles from './GrowthEngineStyles';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label='first page'>
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label='previous page'>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'>
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'>
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function CustomPaginationActionsTable() {
  const [rows, setRows] = useState<TGrowthEngineEntry[]>([]);
  const [originalRows, setOriginalRows] = useState<TGrowthEngineEntry[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [mainSkill, setMainSkill] = useState('');
  const [isAddLoading, setIsAddLoading] = useState(false);

  const styles = useStyles();
  const muiStyles = makeStyles({
    root: {
      color: 'white !important',
    },
  });

  const classes = muiStyles();

  useEffect(() => {
    MiscService.getGrowthEngineEntries().then(res => {
      setRows(res);
      setOriginalRows(res);
    });
  }, []);

  const onSearch = (searchedVal: string) => {
    setPage(0);
    const filteredRows = originalRows.filter((row: TGrowthEngineEntry) => {
      return row.email.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const textInputOnChange = (text: string) => {
    onSearch(text);
  };

  const resetInputs = () => {
    setEmail('');
    setFirstName('');
    setAccountType('');
    setYearsOfExperience('');
    setMainSkill('');
  };

  const onAddEntryClick = () => {
    const newEntry = {
      email: email.toLocaleLowerCase(),
      firstName: firstName.toLocaleLowerCase(),
      accountType: accountType.toLocaleLowerCase(),
      yearsOfExperience: yearsOfExperience.toLocaleLowerCase(),
      mainSkill: mainSkill.toLocaleLowerCase(),
    };
    setIsAddLoading(true);
    MiscService.addGrowthEngineEntry(newEntry)
      .then(() => {
        setRows(prev => [...prev, newEntry]);
        setOriginalRows(prev => [...prev, newEntry]);
        setIsAddLoading(false);

        resetInputs();
      })
      .catch(error => {
        toast.error('There was an error adding entry to Growth Engine:', error);
        setIsAddLoading(false);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.smallTextInputsContainer}>
        <KeeperTextInput
          onChange={setEmail}
          value={email}
          label='Email'
          containerStyles={styles.smallTextContainer}
          inputStyles={styles.smallTextInput}
        />
        <KeeperTextInput
          onChange={setFirstName}
          value={firstName}
          label='First Name'
          containerStyles={styles.smallTextContainer}
          inputStyles={styles.smallTextInput}
        />
        <KeeperTextInput
          onChange={setAccountType}
          value={accountType}
          label='Account Type'
          containerStyles={styles.smallTextContainer}
          inputStyles={styles.smallTextInput}
        />
        <KeeperTextInput
          onChange={setYearsOfExperience}
          value={yearsOfExperience}
          label='Years Of Experience'
          containerStyles={styles.smallTextContainer}
          inputStyles={styles.smallTextInput}
        />
        <KeeperTextInput
          onChange={setMainSkill}
          value={mainSkill}
          label='Main Skill'
          containerStyles={styles.smallTextContainer}
          inputStyles={styles.smallTextInput}
        />
      </div>

      <div style={styles.addEntryButtonContainer}>
        <Button
          style={!email ? styles.disabledAddEntryButton : styles.addEntryButton}
          variant='contained'
          component='label'
          onClick={onAddEntryClick}
          disabled={!email}>
          {isAddLoading ? (
            <LoadingSpinner size='30' />
          ) : (
            <AppBoldText style={styles.uploadResumeText}>Add Entry</AppBoldText>
          )}
        </Button>
      </div>

      <KeeperTextInput onChange={textInputOnChange} label='Search' containerStyles={styles.searchContainer} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 200 }} stickyHeader aria-label='custom pagination table'>
          <TableHead sx={styles.grey}>
            <TableRow sx={styles.grey}>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Account Type</TableCell>
              <TableCell>Years Of Experience</TableCell>
              <TableCell>Main Skill</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={styles.tableBody}>
            {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(row => (
              <TableRow key={row.email}>
                <TableCell className={classes.root}>{row.email}</TableCell>
                <TableCell className={classes.root}>{row.firstName}</TableCell>
                <TableCell className={classes.root}>{row.accountType}</TableCell>
                <TableCell className={classes.root}>{row.yearsOfExperience}</TableCell>
                <TableCell className={classes.root}>{row.mainSkill}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
