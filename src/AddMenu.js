import React from "react"
import MyNavBar from "./Nabar"


import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { TextField, FormControl, Checkbox, FormControlLabel, Button } from "@material-ui/core/"
import Dropzone from 'react-dropzone'
import { useFirestore, useStorage } from "reactfire"
import firebase from "firebase"
import { v4 as uuid } from 'uuid';


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function TransitionsModal({ close }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        close()
    };

    const [change, setChange] = React.useState(false);

    const nameRef = React.useRef(null)
    const descRef = React.useRef(null)
    const latRef = React.useRef(null)
    const lonRef = React.useRef(null)
    const checkRef = React.useRef(null)
    const [file, setFile] = React.useState(null)
    const [fileFetch, setFileFetch] = React.useState(null);
    const [uploading, setUploading] = React.useState(false)
    const [currentLocationSelected, setCurrentLocationSelected] = React.useState(false)
    const [currentLocation, setCurrentLocation] = React.useState(["", ""])
    const [gettingLocation, setGettingLocation] = React.useState(false)

    React.useEffect(() => {
        if (file) {


            let url = URL.createObjectURL(file);
            setFileFetch(url)
        }


    }, [file])


    const getCurrentLocation = () => {

        setGettingLocation(true)
        var options = {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: Infinity
        };

        function success(pos) {
            var crd = pos.coords;


            setCurrentLocation([crd.latitude, crd.longitude])
            setGettingLocation(false)
        }

        function error(err) {
            setGettingLocation(false)
            setCurrentLocationSelected(false)
            alert("Error gettin ur location")
        }

        navigator.geolocation.getCurrentPosition(success, error, options);




    }


    const handleCurrentLocation = () => { setCurrentLocationSelected(!currentLocationSelected); getCurrentLocation(); }

    const handle = () => { setChange(!change) }

    const firestore = useFirestore();
    const ref = firestore.collection("Events");
    const storage = useStorage().ref();

    const add = () => {
        try {


            setUploading(true)
            let name = nameRef.current.value;
            let desc = descRef.current.value;


            let lat = currentLocation[0] || latRef.current.value;
            let lon = currentLocation[1] || lonRef.current.value;
            let check = change;


            let photoName = uuid();


            let location = new firebase.firestore.GeoPoint(lat, lon);



            let ogg = { name, desc, location, check }

            let uploadProgress = storage.child(photoName).put(file).catch(console.log)

            let docCreate = ref.add(ogg).catch(console.log)

            Promise.all([uploadProgress, docCreate]).then(() => { setUploading(false) }).catch((e) => {
                console.log(e)
                alert("There was an error");
                setUploading(false)
            })
        } catch (error) {
            alert("There was an error");
            console.log(error)
            setUploading(false)
        }






    }




    return (
        <div>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Add a new event</h2>
                        <FormControl onSubmit={e => { e.preventDefault() }}>
                            <TextField label="Name" className="input" inputRef={nameRef} required />
                            <TextField label="Description" className="input" inputRef={descRef} required />

                            <div><FormControlLabel
                                control={<Checkbox

                                    checked={currentLocationSelected}
                                    onClick={handleCurrentLocation}

                                />}
                                label="Where are you now?"
                            />

                                {gettingLocation && <div>Getting your current location</div>}

                            </div>

                            {!currentLocationSelected ? <div style={{ display: "inline" }}>
                                <TextField label="Latitude" className="input" inputRef={latRef} required />
                                <TextField label="Longitude" inputRef={lonRef} className="input" style={{ marginLeft: "10px" }} required />
                            </div> : <div>We ll use your current location</div>}


                            <FormControlLabel
                                control={<Checkbox
                                    inputRef={checkRef}
                                    checked={change}
                                    onClick={handle}

                                />}
                                label="Public?"
                            />

                            {file && <img src={fileFetch} width="100" height="100" />}


                            <Dropzone onDrop={acceptedFiles => setFile(acceptedFiles[0])} multiple={false} required>
                                {({ getRootProps, getInputProps }) => (
                                    <section>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <p>Click or Drop file to upload</p>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>


                            {uploading ? <div>Carico</div> : <Button type="submit" style={{ marginTop: "20px" }} disabled={gettingLocation} onClick={add}> Add </Button>}

                        </FormControl>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}



export default function AddMenu({ close }) {


    return <div>  <TransitionsModal close={close} /> </div>
}