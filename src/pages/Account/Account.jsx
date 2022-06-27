import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { userAtom } from '../../atoms/contextAtom';
import { useRecoilState } from 'recoil';
import { Form, Card, Button } from 'react-bootstrap';
import { db, collection, query, where, getDocs } from '../../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';

const Account = () => {
	const [user, setUser] = useRecoilState(userAtom);
	const [missingPersonsList, setMissingPersonsList] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// Function to get list of missingPersons from the database where creator uid is equal to the user's uid
	const getMissingPersons = async () => {
		let postedByUser = [];
		const q = query(collection(db, 'missingPersons'), where('creator.uid', '==', user.uid));

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log( doc.id, ' => ', doc.data() );
			postedByUser.push(doc);
		});
		return postedByUser;
	};

	useEffect(() => {
		getMissingPersons()
			.then((missingPersonsList) => {
				setMissingPersonsList(missingPersonsList);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<>
			<div className='w-100 row'>
				<Card className='p-3 rounded-3 col col-lg-8 col-md-10 mx-auto'>
					<h3 className='text-center mt-4'>{user.displayName} Account</h3>
					{/* List with posted missing person with user id equal to this user */}
					<Card.Body>
						<Card.Title>Missing Persons</Card.Title>
						<table className='table table-striped table-light table-sm align-middle'>
							<thead>
								<tr>
									<th scope='col' className='text-center'>
										#
									</th>
									<th scope='col'>Description</th>
									<th scope='col' className='text-center'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{missingPersonsList.map((missingPerson, index) => (
									<tr key={index}>
										<td scope='row' className='text-center'>
											{index + 1}
										</td>
										<td scope='row'>
											<Link
												className='text-decoration-none'
												to={`/missing-person/${missingPerson.id}`}>
												<i className='fa-regular fa-link'></i> {missingPerson.data().name},{' '}
												{missingPerson.data().gender}, {missingPerson.data().age}y.
											</Link>
										</td>
										<td scope='row' className='text-center'>
											<div class='btn-group' role='group' aria-label='Basic example'>
												<button
													onClick={() => navigate('/edit/')}
													type='button'
													class='btn btn-warning'>
													<i className='fa-regular fa-user-pen'></i>
												</button>
												<button
													onClick={() => navigate('/delete/')}
													type='button'
													class='btn btn-danger'>
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
