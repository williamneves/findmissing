import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { userAtom } from '../../atoms/contextAtom';
import { useRecoilState } from 'recoil';
import { Form, Card, Button, Modal } from 'react-bootstrap';
import {
	db,
	collection,
	query,
	where,
	getDocs,
	onSnapshot,
	orderBy,
	doc,
	updateDoc,
} from '../../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment-timezone';
import ViewReportModal from '../../components/ViewReportModal/ViewReportModal';

const Account = () => {
	const [count, setCount] = useState(1);
	const [user, setUser] = useRecoilState(userAtom);
	const [missingPersonsList, setMissingPersonsList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [reports, setReports] = useState([]);
	const [show, setShow] = useState('');
	const handleShow = (id) => setShow(id);
	const navigate = useNavigate();

	// Subscribe to Report Collection
	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collection(db, `report/missingPerson/${user.uid}`), orderBy('createdAt', 'desc')),
			(snapshot) => {
				// const reports = snapshot.docs.map((doc) => doc.data());
				setReports(snapshot.docs);
			}
		);
		return () => unsubscribe();
	}, [user]);

	// Function to update the status of a report between read and unread
	const updateReport = async (creatorUID, reportId, read) => {
		const toastId = toast.loading('Updating Report...');
		const docRef = doc(db, `report/missingPerson/${creatorUID}`, reportId);
		updateDoc(docRef, { read: read })
			.then(() => {
				toast.success('Report Updated', { id: toastId });
				setShow(false);
			})
			.catch((error) => {
				toast.error(error.message, { id: toastId });

				console.log(error);
			});
	};

	// Function to archive a report and hide from the list
	const archiveReport = async (creatorUID, reportId) => {
		const toastId = toast.loading('Archiving Report...');
		const docRef = doc(db, `report/missingPerson/${creatorUID}`, reportId);
		updateDoc(docRef, { archived: true })
			.then(() => {
				toast.success('Report Archived', { id: toastId });
				setShow(false);
			})
			.catch((error) => {
				toast.error(error.message, { id: toastId });

				console.log(error);
			});
	};

	// Handle Missing Person List
	// Subscribe to the missingPersons collection and update the missingPersonsList state whenever a new missingPerson is added\
	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(
				collection(db, 'missingPersons'),
				where('creator.uid', '==', user.uid),
				where('archived', '==', false),
				orderBy('createdAt', 'desc')
			),
			(snapshot) => {
				// const missingPersonsList = snapshot.docs.map((doc) => doc.data());
				setMissingPersonsList(snapshot.docs);
			}
		);
		return () => unsubscribe();
	}, [db]);

	// Function to update the status of a missingPerson between found and not found
	const statusMissingPerson = async (missingPersonUID, found) => {
		const toastId = toast.loading('Updating Status...');
		const docRef = doc(db, `missingPersons`, missingPersonUID);
		updateDoc(docRef, { found: found })
			.then(() => {
				toast.success('Status Updated', { id: toastId });
				setShow(false);
			})
			.catch((error) => {
				toast.error(error.message, { id: toastId });

				console.log(error);
			});
	};

	// Function to update the status of a missingPerson between found and not found
	const archiveMissingPerson = async (missingPersonUID) => {
		const toastId = toast.loading('Deleting Missing Person...');
		const docRef = doc(db, `missingPersons`, missingPersonUID);
		updateDoc(docRef, { archived: true })
			.then(() => {
				toast.success('Deleted', { id: toastId });
				setShow(false);
			})
			.catch((error) => {
				toast.error(error.message, { id: toastId });

				console.log(error);
			});
	};

	const countPlusOne = () => {
		setCount(count + 1);
	};

	return (
		<>
			<div className='w-100 row'>
				<Card className='p-3 rounded-3 col col-lg-8 col-md-10 mx-auto'>
					<h3 className='text-center mt-4'>{user.displayName} Account</h3>
					{/* Report Notifications */}
					<Card.Body>
						<Card.Title>Reports Notifications</Card.Title>
						<table key={'10'} className='table table-striped table-light table-sm align-middle'>
							<thead key={'21'} className='px-2'>
								<tr key={'1'}>
									<th scope='col' className='px-2'>Date</th>
									<th scope='col'>Missing People</th>
									<th scope='col' className='text-center'>
										Status
									</th>
									<th scope='col' className='text-center'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{reports.map(
									(report, i) =>
										!report.data().archived && (
											<>
												<tr key={i}>
													<td scope='row'>
														<Moment fromNow className='pr-5 ms-2 text-xs text-muted'>
															{report.data().createdAt.toDate()}
														</Moment>
													</td>
													<td>
														<Link
															to={`/missing-person/${report.data().missingPersonUID}`}
															className='text-decoration-none'>
															<i className='fa-regular fa-link'></i>{' '}
															{report.data().missingPerson.name}
														</Link>
													</td>
													<td scope='row' className='text-center'>
														{report.data().read === false ? (
															<i className='text-primary fa-duotone fa-envelope-dot fa-lg'></i>
														) : (
															<i className='fa-duotone fa-envelope-open fa-lg text-secondary'></i>
														)}
													</td>
													<td scope='row' className='d-flex justify-content-center'>
														<div
															className='btn-group btn-group-sm me-3'
															role='group'
															aria-label='Basic example'>
															<button
																onClick={() => handleShow(report.data().missingPersonUID)}
																type='button'
																className='btn btn-outline-primary'>
																<i className='fa-duotone fa-eye'></i>
															</button>
															<button
																onClick={() => navigate('/edit/')}
																type='button'
																className='btn btn-outline-success'>
																<i className='fa-duotone fa-envelope-circle-check'></i>
															</button>
															<button
																onClick={() =>
																	archiveReport(report.data().missingPerson.creator.uid, report.id)
																}
																type='button'
																className='btn btn-outline-secondary btn-sm'>
																<i className='fa-duotone fa-box-archive'></i>
															</button>
														</div>
													</td>
												</tr>
												<ViewReportModal
													show={show}
													setShow={setShow}
													data={report.data()}
													id={report.id}
													onMarkAsRead={updateReport}
												/>
											</>
										)
								)}
							</tbody>
						</table>
					</Card.Body>

					{/* List with posted missing person with user id equal to this user */}
					<Card.Body>
						<Card.Title>Missing Persons</Card.Title>
						<table className='table table-striped table-light table-sm align-middle'>
							<thead key={'2'}>
								<tr key={'3'}>
									<th scope='col' className='text-center'>
										#
									</th>
									<th scope='col'>Description</th>
									<th scope='col' className='text-center'>
										Status
									</th>
									<th scope='col' className='text-center'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{missingPersonsList.map((missingPerson, index) => (
									<tr key={index}>
										<th scope='row' className='text-center'>
											{index + 1}
										</th>
										<td scope='row'>
											<Link
												className='text-decoration-none'
												to={`/missing-person/${missingPerson.id}`}>
												<i className='fa-regular fa-link'></i> {missingPerson.data().name},{' '}
												{missingPerson.data().gender}, {missingPerson.data().age}y.
											</Link>
										</td>
										<td scope='row' className='text-center'>
											{missingPerson.data().found === true ? (
												<span className='badge bg-success'>Found</span>
											) : (
												<span className='badge bg-secondary'>Not Found</span>
											)}
										</td>
										<td scope='row' className='text-center'>
											<div
												className='btn-group btn-group-sm'
												role='group'
												aria-label='Basic example'>
												<button
													onClick={() =>
														statusMissingPerson(missingPerson.id, !missingPerson.data().found)
													}
													type='button'
													className={`btn ${
														!missingPerson.data().found ? 'btn-success' : 'btn-danger'
													}`}>
													{!missingPerson.data().found ? (
														<i className='fa-duotone fa-person-circle-check'></i>
													) : (
														<i className='fa-duotone fa-person-circle-minus'></i>
													)}
												</button>
												<button
													onClick={() => navigate(`/missing-person/${missingPerson.id}/edit`)}
													type='button'
													className='btn btn-warning'>
													<i className='fa-regular fa-user-pen'></i>
												</button>
												<button
													onClick={() => archiveMissingPerson(missingPerson.id)}
													type='button'
													className='btn btn-danger'>
													<i className='fa-regular fa-trash-can'></i>
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</Card.Body>
				</Card>
			</div>
		</>
	);
};

export default Account;
