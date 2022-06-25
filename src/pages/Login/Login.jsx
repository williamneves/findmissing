import React, { useState, useEffect } from 'react';
import { Form, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
	auth,
	providerGoogle,
	providerFacebook,
	getAdditionalUserInfo,
	deleteUser,
	signInWithEmailAndPassword,
	signInWithPopup,
} from '../../lib/firebase';
import toast from 'react-hot-toast';

const Login = () => {
	// States for the email and password
	const [form, setForm] = useState({
		email: '',
		password: '',
	});
	// Validation States for email and password
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
		if (e.target.name === 'email') {
			setEmailError('');
		}
		if (e.target.name === 'password') {
			setPasswordError('');
		}
	};

	// Validation
	const validateForm = () => {
		// Check if email is empty
		if (form.email === '') {
			setEmailError('Email is required');
			return false;
		}
		// Check if email is valid
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			setEmailError('Email is invalid');
			return false;
		}

		// Check if password is empty
		if (form.password === '') {
			setPasswordError('Password is required');
			return false;
		}

		return true;
	};

	// Handle form submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		// Set loading to true
		setLoading(true);
		// Create a toster to show the loading
		const toastId = toast.loading('Loading...');

		// Validate the form
		const isValid = validateForm();
		// If the form is not valid, return
		if (!isValid) {
			setLoading(false);
			toast.error('Check the form...', { id: toastId });
			return;
		}

		// Sign in with email and password
		try {
			// Catch the new user
			const newUser = await signInWithEmailAndPassword( auth, form.email, form.password );
			
			console.log(newUser);
			// Save user UID, email and displayName, photoURL in localStorage
			localStorage.setItem(
				'user',
				JSON.stringify({
					displayName: newUser.user.displayName,
					photoURL: newUser.user.photoURL,
				})
			);

			// Toast the success message
			toast.success(`Welcome ${newUser.user.displayName}`, { id: toastId });

			// Redirect to the home page
			navigate('/');
		} catch (error) {
			setLoading(false);
			// Toast the error message
			if (error.code === 'auth/user-not-found') {
				toast.error(`Email not found`, { id: toastId });
				setEmailError('Email not found');
			} else if (error.code === 'auth/wrong-password') {
				setPasswordError('Wrong password');
				toast.error(`Wrong password`, { id: toastId });
			} else {
				toast.error(`Something went wrong`, { id: toastId });
			}
		}
	};

	return (
		<div className='w-100 row'>
			<Card className='col col-md-3 shadow rounded-3 p-3 position-absolute top-50 start-50 translate-middle'>
				<h3 className='text-center mt-4'>Welcome Back</h3>
				<hr className='mt-1 mb-3' />
				<Form noValidate onSubmit={handleSubmit}>
					<Form.Group className='mb-3' controlId='loginEmail'>
						<Form.Label>Email address</Form.Label>
						<Form.Control
							name='email'
							type='email'
							placeholder='Enter email'
							value={form.email}
							onChange={handleChange}
							isInvalid={emailError}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{emailError}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className='mb-4' controlId='loginPassword'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							name='password'
							type='password'
							placeholder='Password'
							value={form.password}
							onChange={handleChange}
							isInvalid={passwordError}
							disabled={loading}
						/>
						<Form.Control.Feedback type='invalid' className='text-end pe-2'>
							{passwordError}
						</Form.Control.Feedback>
					</Form.Group>

					<Button
						variant='primary'
						type='submit'
						className='float-end mb-4 w-100'
						disabled={loading}>
						{loading ? 'Loading...' : 'Login'}
					</Button>
				</Form>
			</Card>
		</div>
	);
};

export default Login;
