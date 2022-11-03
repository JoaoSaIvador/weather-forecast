import React, { useContext } from 'react';
import { GlobalState } from '../GlobalState';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function RemoveLocationModal({ show, onHide, removeLocation }) {
    const state = useContext(GlobalState);
    const [theme] = state.theme;

    return (
        <Modal className={theme === 'light' ? '' : 'dark-modal'} show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">Remove Location</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Are you sure you want to <b>remove</b> this location from your list? Please confirm.</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant={theme === 'light' ? 'dark' : 'secondary'} onClick={onHide}>Cancel</Button>
                <Button variant="danger" onClick={removeLocation}>Confirm</Button>
            </Modal.Footer>
        </Modal>

    );
}

export default RemoveLocationModal;