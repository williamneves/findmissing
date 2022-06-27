import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const Home = () => {
	const [fakeCards, setFakeCards] = useState([]);

	const createRandomMissingPerson = () => {
		const fakeGender = faker.name.gender(true);
		return {
			// Random choice from male or female
			name: faker.name.findName(undefined, undefined, fakeGender),
			gender: fakeGender,
			age: faker.mersenne.rand(1, 80),
			weight: faker.mersenne.rand(5, 300),
			profileImage: faker.image.avatar(),
		};
	};

	useEffect(() => {
		if (fakeCards.length === 0) {
			const newCards = [];
			for (let i = 0; i < 12; i++) {
				newCards.push(createRandomMissingPerson());
			}
			setFakeCards(newCards);
		}
	}, []);

	return (
		<>
			<h1>Find missing one</h1>
			<div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 justify-content-start align-items-start align-items-stretch'>
				{fakeCards.map((card, index) => {
					return (
						<div className='col mb-4' key={index}>
							<div key={index} className='card h-100 overflow-hidden rounded-3'>
								<img src={card.profileImage} alt={card.name} className='ratio ratio-1x1' />
								<ul className='list-group list-group-flush'>
									<li className='list-group-item'>
										<a
											href='#'
											alt='More Details'
											className='mb-0 mt-2 text-decoration-none h4 text-dark d-flex justify-content-between align-items-center'>
											<span>{card.name}</span>
											<a href="" className="btn btn-sm btn-outline-primary"><i class='fa-solid fa-up-right-from-square'></i></a>
										</a>
									</li>
									<li className='list-group-item'>Age: {card.age}</li>
									<li className='list-group-item'>Gender: {card.gender}</li>
									<li className='list-group-item'>Approx. Weight: {card.weight} lbs.</li>
									<li className='list-group-item d-flex justify-content-between align-items-center'>
										<span>Last Location: City, State.</span>
										<a href='#' className='btn btn-primary btn-sm'>
											<i className='fa-solid fa-map-location'></i>
										</a>
									</li>
									<li className='list-group-item'>
										Some quick example text to build on the card title and make up the bulk of the
										card's content.
									</li>
									<li className='list-group-item d-flex justify-content-between align-items-center'>
										<span>Did you saw me?</span>
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
