import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
// dialog
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const schema = yup.object().shape({
    email: yup.string().email().trim().required(),
    password: yup.string().max(256).trim().required(),
    confirmPass: yup.string().max(256).trim().required(),
})

const nrSchema = yup.object().shape({
    nr: yup.number().max(10000).positive().integer().required()
})

function Register() {
    const history = useHistory();
    const [open, setOpen] = React.useState(true);
    const [inp, setInp] = React.useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isModal, setIsModal] = useState(false);
    const classes = useStyles();
    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPassword = (e) => {
        setConfirmPass(e.target.value);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleInp = (e) => {
        setInp(e.target.value);
    }

    const verify = () => {
        nrSchema.isValid({
            nr: inp
        })
            .then((res) => {
                if (!res) {
                    return;
                } else {
                    axios.post('/register/verify', { inp, email, password })
                        .then((res) => {
                            if (res.data.status === 'OK') {
                                history.push('/login');
                            } else {
                                // TODO: HANDLE ERROR
                            }
                        })
                        .catch((err) => {
                            // TODO: HANDLE ERROR
                            console.log(err);
                        })
                }
            })
            .catch((er) => {
                // TODO: HANDLE ERROR
                console.log(er);
            })
    }



    const handleRegister = () => {
        // setIsOpen(true);
        // setIsModal(true);
        schema.isValid({
            email: email,
            password: password,
            confirmPass: confirmPass,
        })
            .then((resp) => {
                if (!resp) {
                    return;
                } else {
                    if (confirmPass === password) {
                        axios.post('/register', { email, password })
                            .then((data) => {
                                if (data.data.status === 'OK') {
                                    setIsModal(true);
                                    setOpen(true);
                                    // setIsOpen(true);
                                }
                            })
                            .catch((err) => {
                                // TODO: HANDLE ERROR
                                setIsModal(false);
                                if (err.response.status === 400) {
                                    alert('Email exists already.');
                                } else {
                                    alert('An error occured. Try again.');
                                }
                            })
                    } else {
                        return;
                    }
                }
            })
            .catch((err) => {
                // TODO: HANDLE ERROR
                console.log(err);
            })
    }

    return (
        <div>
            <form className={classes.root}>
                <div>
                    <TextField label="Email" variant="outlined" name="email" type="email" onChange={handleEmail} required />
                </div>
                <div>
                    <TextField label="Password" variant="outlined" name="password" type="password" onChange={handlePassword} required />
                </div>
                <div>
                    <TextField label="Confirm Password" variant="outlined" name="confirmPassword" type="password" onChange={handleConfirmPassword} required />
                </div>
                <div>
                    <Button variant="outlined" color="primary" onClick={handleRegister}>
                        Register
                    </Button>
                </div>
                {
                    isModal === true ?
                        <div>
                            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">
                                    Verify code
                        </DialogTitle>
                                <DialogContent>
                                    <TextField id="outlined-basic" label="Code" variant="outlined" onChange={handleInp} required />
                                    <Button variant="contained" color="primary" onClick={verify}>
                                        Verify
                            </Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        :
                        <></>
                }
            </form>
        </div>
    )
}

export default Register