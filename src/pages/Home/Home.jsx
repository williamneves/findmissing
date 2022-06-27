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

const Home = () => {
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
	});

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
			<h1>Find missing one</h1>
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
									<li className='list-group-item'>~ {card.data().height} cm, ~  {card.data().weight} kg.</li>
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
										<a href='#' className='btn btn-primary'>
											Report <i className='fa-solid fa-location-exclamation'></i>
										</a>
									</li>
								</ul>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default Home;
