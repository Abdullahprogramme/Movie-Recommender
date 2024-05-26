import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { FaFacebookF, FaGithub, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';


const actions = [
    { icon: <FaFacebookF color='blue' />, name: 'Facebook', href: 'https://www.facebook.com/abdullah.tariq.7262' },
    { icon: <FaGithub color='black'/>, name: 'GitHub', href: 'https://github.com/Abdullahprogramme' },
    { icon: <FaLinkedinIn color='blue'/>, name: 'LinkedIn', href: 'https://www.linkedin.com/in/abdullahtariq78/' },
    { icon: <FaEnvelope color='red'/>, name: 'Email', href: 'mailto:abdtariq78@gmail.com' },
];
  
export default function NavBar() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <SpeedDial
            ariaLabel="SpeedDial"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            className='main-speed-dial'
        >
        {actions.map((action) => (
            <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={(event) => {
                handleClose();
                event.preventDefault();
                window.open(action.href, '_blank', 'noopener,noreferrer');
            }}
            className='action-speed-dial'
            />
        ))}
        </SpeedDial>
    );
}
