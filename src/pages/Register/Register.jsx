import React, { useState, useEffect } from 'react';
import { Form, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
	auth,
	providerGoogle,
	providerFacebook,
	db,
	doc,
	setDoc,
	getDoc,
	serverTimestamp,
	createUserWithEmailAndPassword,
	updateProfile,
	signInWithPopup,
} from '../../lib/firebase';

import toast from 'react-hot-toast';

const Register = () => {
	// States for the email and password
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	// Validation States for email and password
	const [validationErrors, setValidationErrors] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	// Loading state
	const [loading, setLoading] = useState(false);

	// Create const navigate to use in the submit function
	const navigate = useNavigate();

	// Handle the change of the email and password
	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});

		// Clear the error message when the user starts typing
		if (e.target.name === 'name') {
			setValidationErrors({
				...validationErrors,
				name: '',
			});
		}
		if (e.target.name === 'email') {
			setValidationErrors({
				...validationErrors,
				email: '',
			});
		}
		if (e.target.name === 'password') {
			setValidationErrors({
				...validationErrors,
				password: '',
			});
		}
		if (e.target.name === 'confirmPassword') {
			setValidationErrors({
				...validationErrors,
				confirmPassword: '',
			});
		}
	};

	// Validation
	const validateForm = () => {
		let validationObj = {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		};

		let isValid = true;
		// Check if name is empty
		if (form.name === '') {
			validationObj.name = 'Name is required';
			isValid = false;
		}
		// Check if name has at least 2 characters and just letters and spaces
		// if (form.name.length < 2 || !/^[a-zA-Z ]+$/.test(form.name)) {
		if (!/^[a-zA-Z ]{2,}$/.test(form.name)) {
			validationObj.name = 'Invalid name, or too short';
			isValid = false;
		}

		// Check if email is empty
		if (form.email === '') {
			validationObj.email = 'Email is required';
			isValid = false;
		}
		// Check if email is valid
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			validationObj.email = 'Email is invalid';
			isValid = false;
		}

		// Check if password is empty
		if (form.password === '') {
			validationObj.password = 'Password is required';
			isValid = false;
		}
		// Check if password has at least 8 characters, with at least 1 number, 1 lowercase and 1 uppercase letter
		if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(form.password)) {
			validationObj.password = 'Password is invalid';
			isValid = false;
		}
		// Check if confirm password is empty
		if (form.confirmPassword === '') {
			validationObj.confirmPassword = 'Confirm password is required';
			isValid = false;
		}

		// Check if password and confirm password are the same
		if (form.password !== form.confirmPassword) {
			validationObj.confirmPassword = 'Passwords do not match';
			isValid = false;
		}

		if (!isValid) {
			setValidationErrors(validationObj);
		}

		return isValid;
	};

	// Handle form submit
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Set loading to true
		setLoading(true);

		// Create a toster to show the loading
		const toastId = toast.loading('Loading...');

		// If the form is not valid, return
		console.log(validateForm());
		if (!validateForm()) {
			setLoading(false);
			toast.error('Check the form...', { id: toastId });
			return;
		}

		try {
			// If validation is true, create a new user
			const createdUser = await createUserWithEmailAndPassword(auth, form.email, form.password);

			// Get random avatar photo with initials
			// Check if name has 2 words
			const nameArray = form.name.trim().split(' ');
			let photoURL = `https://ui-avatars.com/api/?name=${form.name[0]}+${form.name[1]}&size=256&background=random`;

			// If name has more than 2 words, get the first 2 letters from each word
			if (nameArray.length >= 2) {
				photoURL = `https://ui-avatars.com/api/?name=${nameArray[0][0]}+${nameArray[1][0]}&size=256&background=random`;
				console.table(nameArray);
			}

			await updateProfile(createdUser.user, {
				displayName: form.name,
				photoURL: photoURL,
			});

			await setDoc(doc(db, 'users', createdUser.user.uid), {
				uid: createdUser.user.uid,
				displayName: createdUser.user.displayName,
				email: createdUser.user.email,
				photoURL: createdUser.user.photoURL,
				createdAt: serverTimestamp(),
      } );
      
      // Set user data to local storage
      localStorage.setItem( 'user', JSON.stringify( {
        displayName: createdUser.user.displayName,
        photoURL: createdUser.user.photoURL
      } ) );
      
			// Finish the loading and redirect to the account page
			toast.success(`Welcome ${form.name}`, {
				id: toastId,
			});
      setLoading( false );
      
      navigate( "/" );
      
		} catch (err) {
			// If there is an error, show the error message
			if (err.code === 'auth/email-already-in-use') {
				toast.error('Email already in use', { id: toastId });
				setValidationErrors({
					...validationErrors,
					email: 'Email already in use',
				});
				setLoading(false);
			} else {
				// console.log('err',err)
				toast.error('Something went wrong, please try again' + err.code, {
					id: toastId,
				});
				setLoading(false);
			}
		}
	};

	return (
		<div className='w-100 row'>
			<Card className='col col-md-3 shadow rounded-3 p-3 position-absolute top-50 start-50 translate-middle'>
				<h3 className='text-center mt-4'>Create Account</h3>
				<hr className='mt-1 mb-3' />
				<Form noValidate onSubmit={handleSubmit}>
					<Form.Group className='mb-3' controlId='registerName'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							name='name'
							type='text'
							placeholder='Enter your name'
							value={form.name}
							onChange={handleChange}
							isInvalid={validationErrors.name}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.name}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className='mb-3' controlId='loginEmail'>
						<Form.Label>Email address</Form.Label>
						<Form.Control
							name='email'
							type='email'
							placeholder='Enter email'
							value={form.email}
							onChange={handleChange}
							isInvalid={validationErrors.email}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.email}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className='mb-3' controlId='loginPassword'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							name='password'
							type='password'
							placeholder='Password'
							value={form.password}
							onChange={handleChange}
							isInvalid={validationErrors.password}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.password}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className='mb-4' controlId='loginPassword'>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							name='confirmPassword'
							type='password'
							placeholder='Password'
							value={form.confirmPassword}
							onChange={handleChange}
							isInvalid={validationErrors.confirmPassword}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{validationErrors.confirmPassword}
						</Form.Control.Feedback>
					</Form.Group>

					<Button
						variant='primary'
						type='submit'
						className='float-end mb-4 w-100'
						disabled={loading}>
						{loading ? 'Loading...' : 'Create Account'}
					</Button>
				</Form>
			</Card>
		</div>
	);
};

export default Register;
