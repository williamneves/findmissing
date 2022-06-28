import React, { useState, useEffect } from 'react';
import './Home.css'
import { faker } from '@faker-js/faker';
import {
	db,
	doc,
	setDoc,
	addDoc,
	collection,
	getDoc,
	serverTimestamp,
	onSnapshot,
	query,
	orderBy,
	where,
	limit,
} from '../../lib/firebase';
import { Link } from 'react-router-dom';
import { Modal, Form, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

const Home = () => {
	const [ show, setShow ] = useState( false );
	const [modalForm, setModalForm] = useState({
		report: '',
		contactInfo: '',
	});
	const handleClose = () => setShow(false);
	const [fakeCards, setFakeCards] = useState([]);
	const [missingPersonsCard, setMissingPersonsCard] = useState([]);
	const [missingPersonsCardShuffled, setMissingPersonsCardShuffled] = useState([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [filters, setFilters] = useState({
		orderBy: {
			field: 'createdAt',
			direction: 'desc',
		},
		where: '',
		limit: '',
	} );

	const handleShow = (id) => setShow(id);
	
	// Handle Modal Inputs Change
	const handleModalChange = (e) => {
		setModalForm({
			...modalForm,
			[e.target.name]: e.target.value,
		});
	};

	const handleReport = async ( e, id, missingPerson ) => {
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

	// const createRandomMissingPerson = () => {
	// 	const fakeGender = faker.name.gender(true);
	// 	return {
	// 		// Random choice from male or female
	// 		name: faker.name.findName(undefined, undefined, fakeGender),
	// 		gender: fakeGender,
	// 		age: faker.mersenne.rand(1, 80),
	// 		weight: faker.mersenne.rand(5, 300),
	// 		profileImage: faker.image.avatar(),
	// 	};
	// };

	// useEffect(() => {
	// 	if (fakeCards.length === 0) {
	// 		const newCards = [];
	// 		for (let i = 0; i < 12; i++) {
	// 			newCards.push(createRandomMissingPerson());
	// 		}
	// 		setFakeCards(newCards);
	// 	}
	// }, [fakeCards]);

	// Shuffle the cards
	const shuffleArray = (array) => {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	};

	// Subscribe to missing persons collection
	useEffect(() => {
		setLoading(true);
		const unSub = onSnapshot(
			query(
				collection(db, 'missingPersons'),
				where('found', '==', false),
				orderBy(filters.orderBy.field, filters.orderBy.direction)
			),
			(snapshot) => {
				let shuffledList = shuffleArray(snapshot.docs);
				
				setMissingPersonsCard( shuffledList );
				setLoading(false);
			}
		);
		
		return () => {
			unSub();
		}

	}, [ db, filters ] );
	
	if ( loading ) {
		return <div>Loading...</div>;
	}


	return (
		<>
			<h4>Maybe you know someone...</h4>
			<h6 className='text-muted'>Let's help people find their loved ones again.</h6>
			<small className='text-muted fst-italic'>If you recognize anyone, click in Report!</small>
			<hr />
			<div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 justify-content-start align-items-start align-items-stretch'>
				{missingPersonsCard.map((card, index) => {
					return (
						<div className='col mb-4' key={index}>
							<div key={index} className='card h-100 overflow-hidden rounded-3'>
								<div className='image'>
									<img
										src={card.data().profileIMG}
										alt={card.data().name}
										className='img img-responsive full-width'
									/>
								</div>
								<ul className='list-group list-group-flush'>
									<li className='list-group-item'>
										<Link
											to={`/missing-person/${card.id}`}
											alt='More Details'
											className='mb-0 mt-2 text-decoration-none h4 text-dark d-flex justify-content-between align-items-center'>
											<span>{card.data().name}</span>
											<button className='btn btn-sm btn-outline-primary'>
												<i className='fa-solid fa-up-right-from-square'></i>
											</button>
										</Link>
									</li>
									<li className='list-group-item'>Age: {card.data().age}</li>
									<li className='list-group-item'>Gender: {card.data().gender}</li>
									<li className='list-group-item'>
										~ {card.data().height} cm, ~ {card.data().weight} kg.
									</li>
									<li className='list-group-item d-flex justify-content-between align-items-center'>
										<span>
											<em>Last known location:</em>
											<br />
											{card.data().lastLocation}.
										</span>
										<a href='#' className='btn btn-primary btn-sm'>
											<i className='fa-solid fa-map-location'></i>
										</a>
									</li>
									<li className='list-group-item'>{card.data().moreDetails}</li>
									<li className='list-group-item d-flex justify-content-between align-items-center'>
										<span>You saw me?</span>
										<button onClick={()=>handleShow(card.id)} className='btn btn-primary'>
											Report <i className='fa-solid fa-location-exclamation'></i>
										</button>
									</li>
								</ul>
							</div>
							{/* Modal */}
			<Modal show={show === card.id} onHide={handleClose} backdrop='static' keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={(e)=>handleReport(e,card.id,card.data())} id='modalForm'>
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
						</div>
					);
				})}
			</div>
		</>
	);
};

export default Home;
