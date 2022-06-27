import React, { useState, useEffect } from 'react';
import { userAtom } from '../../atoms/contextAtom';
import { useRecoilState } from 'recoil';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Form, Card, Button } from 'react-bootstrap';
import {
	auth,
	onAuthStateChanged,
	db,
	doc,
	setDoc,
	getDoc,
	serverTimestamp,
	storage,
	ref,
	getDownloadURL,
	uploadString,
} from '../../lib/firebase';

const PostMissing = () => {
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
		modeDetails: '',
		profileIMG: '',
		moreIMGs: '',
	});
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
		modeDetails: '',
		profileIMG: '',
		moreIMGs: '',
	});
	const [loading, setLoading] = useState(false);

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

	// Handle the submit of the form
	const handleSubmit = async (e) => {
		e.preventDefault();

		// handle the upload of the profile image
		const profileIMGReader = new FileReader();
		console.log(e.target.profileIMG.files[0]);
		console.log(e.target.moreIMGs.files);
	};

	return (
		<div className='row mx-auto py-3 rounded-3'>
			<div className='card p-3'>
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
							name='modeDetails'
							type='text'
							placeholder='Aproximated last known location'
							value={form.modeDetails}
							onChange={handleChange}
							isInvalid={validationErrors.modeDetails}
							disabled={loading}
							as='textarea'
							rows={4}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.modeDetails}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='registerProfileIMG'>
						<Form.Label>Profile Image</Form.Label>
						<Form.Control
							name='profileIMG'
							type='file'
							value={form.profileIMG}
							onChange={handleChange}
							isInvalid={validationErrors.profileIMG}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.profileIMG}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='registerMoreIMGs'>
						<Form.Label>More Images if needed</Form.Label>
						<Form.Control
							name='moreIMGs'
							type='file'
							value={form.moreIMGs}
							onChange={handleChange}
							disabled={loading}
							multiple={true}
						/>
					</Form.Group>
					<button type='submit' className='btn btn-sm btn-primary w-100'>
						{loading ? 'Loading...' : 'Register'}
					</button>
				</Form>
			</div>
		</div>
	);
};

export default PostMissing;
