import React from 'react';
import { faker } from '@faker-js/faker';
import {
	auth,
	onAuthStateChanged,
	db,
	doc,
	setDoc,
	getDoc,
	updateDoc,
	addDoc,
	collection,
	serverTimestamp,
	storage,
	ref,
	getDownloadURL,
	uploadString,
} from './lib/firebase';
import { userAtom } from './atoms/contextAtom';
import { useRecoilState } from 'recoil';
import toast from 'react-hot-toast';

const Faker = () => {
	const [user, setUser] = useRecoilState(userAtom);
	// Generate random names
	// Generate random male names

	const funcfakePerson = (gender, aproxAge, aproxHeight, aproxWeight) => {
		// Use faker to generate fake male name
		let fakePerson = {
			// Random choice from male or female
			name: faker.name.findName(undefined, undefined, gender),
			alias: faker.name.findName(undefined, undefined, gender),
			age: faker.mersenne.rand(aproxAge - 10, aproxAge + 10),
			gender: gender,
			height: faker.mersenne.rand(aproxHeight - 10, aproxHeight + 10),
			weight: faker.mersenne.rand(aproxWeight - 10, aproxWeight + 10),
			lastLocation: `${faker.address.streetAddress(true)}, UK`,
			lastLocationMap: faker.address.nearbyGPSCoordinate([50.377057, 30.680027], 600, true),
			moreDetails: faker.lorem.words(10),
			profileIMG: faker.image.avatar(),
			found: false,
			creator: user,
			archived: false,
			createdAt: serverTimestamp(),
		};

		return fakePerson;
	};

	// Create X random people
	const list = [];
	const totalPersons = 10;
	const aproxAge = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	const aproxHeight = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	const aproxWeight = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	for (let i = 0; i < totalPersons; i++) {
		let fakePerson = funcfakePerson(
			'Female',
			aproxAge(14, 37),
			aproxHeight(45, 170),
			aproxWeight(25, 70)
		);
		list.push(fakePerson);
	}

	const createData = async () => {
		console.log( list );
		const toastId = toast.loading('Creating fake users...');
		for ( let i = 0; i < list.length; i++ ){
			await addDoc( collection( db, 'missingPersons' ), list[ i ] );
			console.log( `${i+1} of ${list.length}` );
			console.log( list[ i ].name, 'added' );
			toast.loading(`${i+1} of ${list.length} - ${list[ i ].name, 'added'}`, { id: toastId });
		}
		toast.success('Fake users created!', { id: toastId });
	}

	return (
		<>
		<button onClick={createData} className='btn btn-sm btn-primary m-4 mx-auto'>Create</button>
		</>
	);
};

export default Faker;
