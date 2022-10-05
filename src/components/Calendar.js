import React, {useState, useEffect  } from "react"
import Paper from '@mui/material/Paper';
import {
  Scheduler,
  AllDayPanel,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  EditRecurrenceMenu,
  AppointmentTooltip,
  AppointmentForm,
  ViewSwitcher,
  Toolbar,
  DragDropProvider,
  DateNavigator,
  TodayButton,
  ConfirmationDialog
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState, EditingState, IntegratedEditing} from '@devexpress/dx-react-scheduler';
import IconButton from '@mui/material/IconButton';
import MoreIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import Room from '@mui/icons-material/Room';
import { styled } from '@mui/material/styles';
import classNames from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { addAppointment } from "../store/actions/addAppointment";
import { loadAppointments } from "../store/actions/loadAppointments";
import {editAppointment} from "../store/actions/editAppointment";
const PREFIX = 'FrancoUz';

const classes = {
  icon: `${PREFIX}-icon`,
  textCenter: `${PREFIX}-SalaMusicoterapia`,
  firstRoom: `${PREFIX}-SalaPsicoterapia`,
  secondRoom: `${PREFIX}-SalaRadioterapia`,
  thirdRoom: `${PREFIX}-SalaJuegos`,
  bomboneraRoom: `${PREFIX}-LaBombonera`,
  header: `${PREFIX}-header`,
  commandButton: `${PREFIX}-commandButton`,
};

const StyledAppointmentTooltipHeader = styled(AppointmentTooltip.Header)(() => ({
  [`&.${classes.firstRoom}`]: {
    background: 'url(https://js.devexpress.com/Demos/DXHotels/Content/Pictures/Lobby-4.jpg)',
  },
  [`&.${classes.secondRoom}`]: {
    background: 'url(https://js.devexpress.com/Demos/DXHotels/Content/Pictures/MeetingRoom-4.jpg)',
  },
  [`&.${classes.bomboneraRoom}`]: {
    background: 'url(https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2017/05/14174202/boca-river-cancha.jpg)',
  },
  [`&.${classes.thirdRoom}`]: {
    background: 'url(https://js.devexpress.com/Demos/DXHotels/Content/Pictures/MeetingRoom-0.jpg)',
  },
  [`&.${classes.header}`]: {
    height: '260px',
    backgroundSize: 'cover',
  },
}));

const StyledIconButton = styled(IconButton)(() => ({
  [`&.${classes.commandButton}`]: {
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
}));

const StyledGrid = styled(Grid)(() => ({
  [`&.${classes.textCenter}`]: {
    textAlign: 'center',
  },
}));

const StyledRoom = styled(Room)(({ theme: { palette } }) => ({
  [`&.${classes.icon}`]: {
    color: palette.action.active,
  },
}));

const StyledAppointmentTooltipCommandButton = styled(AppointmentTooltip.CommandButton)(() => ({
  [`&.${classes.commandButton}`]: {
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
}));

const getClassByLocation = (classes, location) => {
  if (location === 'Room 1') return classes.firstRoom; //la location esta en el appointment, la cambiamos ahi
  if (location === 'Room 2') return classes.secondRoom;
  if (location === 'La Bombonera') return classes.bomboneraRoom;
  return classes.thirdRoom;
};

const Header = (({
  children, appointmentData, ...restProps
}) => (
  <StyledAppointmentTooltipHeader
    {...restProps}
    className={classNames(getClassByLocation(classes, appointmentData.location), classes.header)}
    appointmentData={appointmentData}
  >
    <StyledIconButton
      /* eslint-disable-next-line no-alert */
      onClick={() => alert(JSON.stringify(appointmentData))}
      className={classes.commandButton}
      size="large"
    >
      <MoreIcon />
    </StyledIconButton>
  </StyledAppointmentTooltipHeader>
));

const Content = (({
  children, appointmentData, ...restProps
}) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <Grid container alignItems="center">
      <StyledGrid item xs={2} className={classes.textCenter}>
        <StyledRoom className={classes.icon} />
      </StyledGrid>
      <Grid item xs={10}>
        <span>{appointmentData.location}</span>
      </Grid>
    </Grid>
  </AppointmentTooltip.Content>
));

const CommandButton = (({
  ...restProps
}) => (
  <StyledAppointmentTooltipCommandButton {...restProps} className={classes.commandButton} />
));

const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === 'multilineTextEditor') {
    return null;
  } return <AppointmentForm.TextEditor {...props} />;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const onPatientFieldChange = (nextValue) => {
    onFieldChange({ patient: nextValue });
  };
  const onProfessionalFieldChange = (nextValue) => {
    onFieldChange({ professional: nextValue });
  };
  const onTherapyFieldChange = (nextValue) => {
    onFieldChange({ therapy: nextValue });
  };

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
     <AppointmentForm.Label
        text="Paciente"
        type="title"
      />
      <AppointmentForm.TextEditor
        value={appointmentData.patient}
        onValueChange={onPatientFieldChange}
        placeholder="Ingrese el paciente correspondiente"
      />

      <AppointmentForm.Label
        text="Profesional"
        type="title"
      />
      <AppointmentForm.TextEditor
        value={appointmentData.professional}
        onValueChange={onProfessionalFieldChange}
        placeholder="Ingrese el profesional correspondiente"
      />

      <AppointmentForm.Label
        text="Tipo de Terapia"
        type="title"
      />
      <AppointmentForm.TextEditor
        value={appointmentData.therapy}
        onValueChange={onTherapyFieldChange}
        placeholder="Ingrese el tipo de terapia correspondiente"
      />
    </AppointmentForm.BasicLayout>
  );
};



export default function Demo(){
  const [currentDate, setCurrentDate] = useState('2022-09-22')
  const data = useSelector(state => state.calendar.appointments);
  const dispatch = useDispatch();
  const handleCurrentDateChange = (currentDate) => {
    setCurrentDate(currentDate)
  }

  const handleCommitChanges = (action) => {
    console.log('commit');
    if(action.added) dispatch(addAppointment(action));
    if(action.changed)dispatch(editAppointment(action));
    /*this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      console.log(this.state);
      return { data };
    });*/
  }
  
  const Appointment = ({
    children, style, ...restProps
  }) => (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: '#FFC107',
        borderRadius: '8px',
      }}
    >
      {children}
    </Appointments.Appointment>
  );

  useEffect(() => {
    dispatch(loadAppointments());
  }, []);

  return (
      <Paper>
        <Scheduler
          data={data}
          height={870}
        >
          <ViewState
            currentDate={currentDate}
            onCurrentDateChange={handleCurrentDateChange}
          />
          <EditingState
            onCommitChanges={handleCommitChanges}
          />

          <WeekView
            startDayHour={8}
            endDayHour={20}
          />
          <DayView />
          <MonthView />

          <EditRecurrenceMenu />
          <ConfirmationDialog />

          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <ViewSwitcher />

          <Appointments appointmentComponent={Appointment}/>
          <AppointmentTooltip
            headerComponent={Header}
            contentComponent={Content}
            commandButtonComponent={CommandButton}
            showOpenButton
            showCloseButton
          />
          <AppointmentForm
            basicLayoutComponent={BasicLayout}
            textEditorComponent={TextEditor}
          />
          
          <DragDropProvider />        
        </Scheduler>
      </Paper>
    )
}