import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, setDoc, addDoc, db, doc, getDoc, serverTimestamp } from '../../lib/firebase';
import { Modal, Form, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

const MissingPeople = () => {
	const [missingPerson, setMissingPerson] = useState(null);
	const [loading, setLoading] = useState(true);
	const { id } = useParams();

	// Modal States
	const [show, setShow] = useState(false);
	const [modalForm, setModalForm] = useState({
		report: '',
		contactInfo: '',
	});

	// Handle Modal Inputs Change
	const handleModalChange = (e) => {
		setModalForm({
			...modalForm,
			[e.target.name]: e.target.value,
		});
	};

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// Get MissingPerson from database using the id in the url
	useEffect(() => {
		const docRef = doc(db, 'missingPersons', id);
		getDoc(docRef)
			.then((docSnap) => {
				if (docSnap.exists()) {
					// console.log('Document data:', docSnap.data());
					setMissingPerson(docSnap.data());
					setLoading(false);
				} else {
					// doc.data() will be undefined in this case
					console.log('No such document!');
				}
			})
			.catch(function (error) {
				console.log('Error getting document:', error);
			});
	}, [id]);

	// Handle the Modal Report Report
	// Create a new document in the 'reports' collection with the MissingPerson data, the message, optional contact information
	const handleReport = async ( e ) => {
		e.preventDefault();
		const toastId = toast.loading( 'Sending Report...' );
		
		const reportObj = {
			...modalForm,
			read: false,
			found: false,
			archived: false,
			missingPersonUID: id,
			missingPerson: missingPerson,
			createdAt: serverTimestamp(),
		}
			
		// Validate the form
		if (modalForm.report.length < 1) {
			toast.error('Please enter a report', { id: toastId });
			return;
		}

		try {
			const newReport = await addDoc(collection(db, `report/missingPerson/${missingPerson.creator.uid}`), reportObj);
			toast.success('Report Sent!', { id: toastId });
			handleClose();
			setModalForm( {
				report: '',
				contactInfo: '',
			} );
		} catch (error) {
			console.log(error);
			toast.error('Error Sending Report!', { id: toastId });
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className='row pb-5'>
				<div className='col col-lg-6 col-md-9 mx-auto'>
					<h2>
						<i className='fa-solid fa-circle-question'></i>
						{missingPerson.name},{' '}
						<span className='text-muted fs-6'>
							{missingPerson.gender}, {missingPerson.age}y
						</span>
					</h2>
					<div className='card overflow-hidden rounded-3'>
						<div className='image'>
							<img
								src={missingPerson.profileIMG}
								alt={missingPerson.name}
								className='img img-responsive full-width'
							/>
						</div>
						<ul className='list-group list-group-flush'>
							<li className='list-group-item bg-light'>More information:</li>
							<li className='list-group-item'>Age: {missingPerson.age}</li>
							<li className='list-group-item'>Gender: {missingPerson.gender}</li>
							<li className='list-group-item'>
								~ {missingPerson.height} cm, ~ {missingPerson.weight} kg.
							</li>
							<li className='list-group-item d-flex justify-content-between align-items-center'>
								<span>
									<em>Last known location:</em>
									<br />
									{missingPerson.lastLocation}.
								</span>
								<a href='#' className='btn btn-primary btn-sm'>
									<i className='fa-solid fa-map-location'></i>
								</a>
							</li>
							<li className='list-group-item'>{missingPerson.moreDetails}</li>
							<li className='list-group-item'>Contact Info: </li>
							<li className='list-group-item d-flex justify-content-between align-items-center'>
								<span>You saw me?</span>
								<button onClick={handleShow} className='btn btn-primary'>
									Report <i className='fa-solid fa-location-exclamation'></i>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Modal */}
			<Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleReport} id='modalForm'>
						<Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
							<Form.Label>Report</Form.Label>
							<Form.Control
								name='report'
								placeholder='Describle your report here'
								as='textarea'
								rows={5}
								onChange={handleModalChange}
								value={modalForm.report}
								autoFocus
								required
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
							<Form.Label>Contact Information (Optional)</Form.Label>
							<Form.Control
								name='contactInfo'
								type='text'
								placeholder='If you accept get contacted, enter your contact info'
								onChange={handleModalChange}
								value={modalForm.contactInfo}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Close
					</Button>
					<Button type='submit' variant='primary' form='modalForm'>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default MissingPeople;
