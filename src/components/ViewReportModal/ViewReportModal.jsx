import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { db, doc, updateDoc } from '../../lib/firebase';
import toast from 'react-hot-toast';


const ViewReportModal = ( { show, setShow, data,id,onMarkAsRead } ) => {
  // const [read, setRead] = useState(data.read);
  
  const handleClose = () => setShow( false );
  
  
  const handleMarkAsRead = () => {
    onMarkAsRead( data.missingPerson.creator.uid, id, !data.read );
    handleClose();
  }
  
  return (
    < >
    <Modal
        show={show === data.missingPersonUID}
        onHide={handleClose}
        backdrop="static"
        keyboard={ false }
        id={ id }
        key={ id }
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Report about <span className="text-primary">{data.missingPerson.name}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{ data.report }</div>
          { data.contactInfo && <div className='mt-3'>{ 'Contact Info: ' + data.contactInfo }</div> }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='d-flex justify-content-between gap-3 align-items-center' onClick={handleClose}>
          Back <i className="fa-regular fa-xmark mt-1"></i>
          </Button>
          {data.read === false ? (<Button variant="success" onClick={handleMarkAsRead}>Mark as Read <i className='fa-duotone fa-envelope-circle-check'></i></Button>):
          (<Button variant="primary" onClick={handleMarkAsRead}>Mark as Unread <i className="fa-duotone fa-envelope-dot"></i></Button>)}
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ViewReportModal