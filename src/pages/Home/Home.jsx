import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';

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
			for (let i = 0; i < 10; i++) {
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
							<div key={index} className='card h-100'>
								<img src={card.profileImage} alt={card.name} />
								<h2>Name: {card.name}</h2>
								<p>Age: {card.age}</p>
								<p>Approx. Weight: {card.weight}</p>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default Home;
