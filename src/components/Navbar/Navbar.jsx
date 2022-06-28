import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar as NavbarBootstrap, Button } from 'react-bootstrap';
import { signOut, auth } from '../../lib/firebase';
import { useRecoilState } from 'recoil';
import { userAtom } from '../../atoms/contextAtom';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = () => {
	const [user, setUser] = useRecoilState(userAtom);
	const navigate = useNavigate();

	// SignOut
	const logout = () => {
		toast.success(`Goodbye ${user.displayName}`);
		signOut(auth).then(() => {
			// Remove user from local storage
			localStorage.removeItem('user');
			// Remove user from state
			setUser( null );
			// Redirect to home page
			navigate('/');
		});
	};

	return (
		<NavbarBootstrap
			collapseOnSelect
			expand='lg'
			bg='dark'
			variant='dark'
			className='mb-3 shadow-sm navbarUK shadow'>
			<Container>
				<NavbarBootstrap.Brand
					as='div'
					className='d-flex align-items-center'
					onClick={() => navigate('/')}
					style={{ cursor: 'pointer' }}>
					<div className='me-1'>
						<i className='fa-duotone fa-family'></i> TogetherAgain
					</div>
					
					<div className='uk-flag'>
						<div></div>
						<div></div>
					</div>
				</NavbarBootstrap.Brand>

				<NavbarBootstrap.Toggle aria-controls='responsive-navbar-nav' />
				<NavbarBootstrap.Collapse id='responsive-navbar-nav'>
					<Nav className='me-auto'>
						<NavLink to='/postmissing' className='nav-link'>
							Post Missing
						</NavLink>
						<NavLink to='/aboutUs' className='nav-link'>
							About Us
						</NavLink>
					</Nav>
					<Nav>
						{user ? (
							<div>
								<Button
									variant='outline-light'
									className='me-3'
									onClick={() => navigate('/account')}>
									<i className='fa-regular fa-circle-user'></i>
								</Button>
								<Button variant='outline-light' className='' onClick={logout}>
									Logout <i className='fa-regular fa-right-from-bracket'></i>
								</Button>
							</div>
						) : (
							<React.Fragment>
								<Button
									variant='outline-light'
									className='me-3 mb-2 mb-lg-0'
									onClick={() => navigate('/login')}>
									Login
								</Button>
								<Button variant='outline-light' onClick={() => navigate('/register')}>
									Register
								</Button>
							</React.Fragment>
						)}
					</Nav>
				</NavbarBootstrap.Collapse>
			</Container>
		</NavbarBootstrap>
	);
};

export default Navbar;
