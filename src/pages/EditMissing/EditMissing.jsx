import React, { useState, useEffect } from 'react';
import { userAtom } from '../../atoms/contextAtom';
import { useRecoilState } from 'recoil';
import { useNavigate, Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Form, Card, Button } from 'react-bootstrap';
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
} from '../../lib/firebase';

const PostMissing = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [user, setUser] = useRecoilState(userAtom);
	const [form, setForm] = useState({
		name: '',
		alias: '',
		age: '',
		gender: '',
		height: '',
		weight: '',
		lastLocation: '',
		lastLocationMap: {
			lat: '',
			long: '',
		},
		moreDetails: '',
		profileIMG: '',
		contactInfo: '',
		moreIMGs: '',
	});
	const [newProfileIMG, setNewProfileIMG] = useState('');
	const [validationErrors, setValidationErrors] = useState({
		name: '',
		alias: '',
		age: '',
		gender: '',
		height: '',
		weight: '',
		lastLocation: '',
		lastLocationMap: {
			lat: '',
			long: '',
		},
		moreDetails: '',
		profileIMG: '',
		contactInfo: '',
		moreIMGs: '',
	});
	const [loading, setLoading] = useState(true);

	// Get MissingPerson from database using the id in the url
	useEffect(() => {
		const docRef = doc(db, 'missingPersons', id);
		getDoc(docRef)
			.then((docSnap) => {
				if (docSnap.exists()) {
					// console.log('Document data:', docSnap.data());
					setForm(docSnap.data());
					// console.log(docSnap.data());
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

	// Handle the change of the fields
	const handleChange = (e) => {
		// Set the field to the value of the input
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});

		// Clean the errors when the user starts typing
		setValidationErrors({
			...validationErrors,
			[e.target.name]: '',
		});
	};
	// Add new profile image to view
	const newProfileIMGToView = (e) => {
		const reader = new FileReader();
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
		}
		reader.onload = (readerEvent) => {
			setNewProfileIMG(readerEvent.target.result);
		};
	};

	// Handle the submit of the form
	const handleSubmit = async (e) => {
		e.preventDefault();
		// Set loading to true
		setLoading(true);
		// Create a toast to show the user that the form is loading
		const toastId = toast.loading('Loading...');

		// Validate the form
		// Check if this file is an image
		if (newProfileIMG) {
			if (!e.target.newProfileIMG.files[0].type.includes('image')) {
				setValidationErrors({
					...validationErrors,
					profileIMG: 'This file is not an image',
				});
				setLoading(false);
				toast.error('This file is not an image', { id: toastId });
				return;
			}

			// Check if the file is too big
			if (e.target.newProfileIMG.files[0].size > 10000000) {
				setValidationErrors({
					...validationErrors,
					profileIMG: 'This file is too big',
				});
				setLoading(false);
				toast.error('This file is too big', { id: toastId });
				return;
			}

			// Create missing person object
			const missingPerson = {
				...form,
				updatedAt: serverTimestamp(),
			};

			try {
				// // Add the missing person to the database
				// const missingPersonRef = await addDoc(collection(db, 'missingPersons'), missingPerson);

				toast.loading('Uploading...', { id: toastId });

				// Upload the profile image
				const profileIMGReader = new FileReader();
				if (e.target.newProfileIMG.files[0]) {
					profileIMGReader.readAsDataURL(e.target.newProfileIMG.files[0]);
				}

				// Upload the profile image
				profileIMGReader.onload = async (readerEvent) => {
					const profileIMGRef = ref(storage, `missingPersons/${id}/profileIMG`);

					await uploadString(profileIMGRef, readerEvent.target.result, 'data_url').then(
						async () => {
							// update the missing person with the profile image url
							const profileIMGURL = await getDownloadURL(profileIMGRef);
							await updateDoc(doc(db, 'missingPersons', id), {
								...missingPerson,
								profileIMG: profileIMGURL,
							});
							console.log('Profile image uploaded');
							toast.success('Profile image uploaded', { id: toastId });
							setLoading( false );
							navigate('/account');
						}
					);
				};
			} catch (error) {
				console.log(error);
				toast.error(error.message, { id: toastId });
				setLoading(false);
			}
		} else {
			// Create missing person object
			const missingPerson = {
				...form,
				updatedAt: serverTimestamp(),
			};

			try {
				// // Add the missing person to the database
				// const missingPersonRef = await addDoc(collection(db, 'missingPersons'), missingPerson);

				toast.loading('Updating...', { id: toastId });

				// update the missing person with the profile image url
				await updateDoc(doc(db, 'missingPersons', id), {
					...missingPerson,
				});
				toast.success('Updated', { id: toastId });
				setLoading( false );
				navigate('/account')
			} catch (error) {
				console.log(error);
				toast.error(error.message, { id: toastId });
				setLoading(false);
			}
		}
	};
	if (loading) {
		return <div className='h3'>loading...</div>;
	}

	return (
		<div className='row mx-auto py-3'>
			<div className='card p-3 rounded-3 col col-lg-6 col-md-9 mx-auto'>
				<h1>Post Missing</h1>
				<Form noValidate onSubmit={handleSubmit}>
					<Form.Group className='mb-3' controlId='registerName'>
						<Form.Label>Missing person name</Form.Label>
						<Form.Control
							name='name'
							type='text'
							placeholder='Missing person name'
							value={form.name}
							onChange={handleChange}
							isInvalid={validationErrors.name}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.name}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='registerAlias'>
						<Form.Label>Alias</Form.Label>
						<Form.Control
							name='alias'
							type='text'
							placeholder='Another known name'
							value={form.alias}
							onChange={handleChange}
							isInvalid={validationErrors.alias}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.alias}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='registerAge'>
						<Form.Label>Age</Form.Label>
						<Form.Control
							name='age'
							type='number'
							placeholder='Age'
							value={form.age}
							onChange={handleChange}
							isInvalid={validationErrors.age}
							disabled={loading}
							max={110}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.age}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='registerGender'>
						<Form.Label>Gender</Form.Label>
						<Form.Select
							name='gender'
							aria-label='Gender'
							value={form.gender}
							disabled={loading}
							onChange={handleChange}>
							<option>-</option>
							<option>Male</option>
							<option>Female</option>
							<option>Prefer not say</option>
						</Form.Select>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.age}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='registerHeight'>
						<Form.Label>Height (in centimeters)</Form.Label>
						<Form.Control
							name='height'
							type='number'
							placeholder='Height in cm'
							value={form.height}
							onChange={handleChange}
							isInvalid={validationErrors.height}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.height}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='registerWeight'>
						<Form.Label>Weight (in kilograms)</Form.Label>
						<Form.Control
							name='weight'
							type='number'
							placeholder='Weight in Kg'
							value={form.weight}
							onChange={handleChange}
							isInvalid={validationErrors.weight}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.weight}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='registerLastLocation'>
						<Form.Label>Last know location</Form.Label>
						<Form.Control
							name='lastLocation'
							type='text'
							placeholder='Aproximated last known location'
							value={form.lastLocation}
							onChange={handleChange}
							isInvalid={validationErrors.lastLocation}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.lastLocation}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='registerMoreDetails'>
						<Form.Label>More Details</Form.Label>
						<Form.Control
							name='moreDetails'
							type='text'
							placeholder='Aproximated last known location'
							value={form.moreDetails}
							onChange={handleChange}
							isInvalid={validationErrors.moreDetails}
							disabled={loading}
							as='textarea'
							rows={4}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.moreDetails}
						</Form.Control.Feedback>
					</Form.Group>
					<div className='w-100 py-3'>
						<img src={newProfileIMG ? `${newProfileIMG}` : `${form.profileIMG}`} alt='' className='w-25' />
					</div>
					<Form.Group className='mb-3' controlId='registerProfileIMG'>
						<Form.Label>Change the Profile Image</Form.Label>
						<Form.Control
							name='newProfileIMG'
							type='file'
							// value={newProfileIMG}
							onChange={(e)=>newProfileIMGToView(e)}
							isInvalid={validationErrors.profileIMG}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.profileIMG}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='registerContactInfo'>
						<Form.Label>Contact Information</Form.Label>
						<Form.Control
							name='contactInfo'
							type='text'
							placeholder='Missing person name'
							value={form.contactInfo}
							onChange={handleChange}
							isInvalid={validationErrors.contactInfo}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.contactInfo}
						</Form.Control.Feedback>
					</Form.Group>
					{/* <Form.Group className='mb-3' controlId='registerMoreIMGs'>
						<Form.Label>More Images if needed</Form.Label>
						<Form.Control
							name='moreIMGs'
							type='file'
							value={form.moreIMGs}
							onChange={handleChange}
							disabled={loading}
							multiple={true}
						/>
					</Form.Group> */}
					<button type='submit' className='btn btn-sm btn-primary w-100'>
						{loading ? 'Loading...' : 'Update'}
					</button>
				</Form>
			</div>
		</div>
	);
};

export default PostMissing;
