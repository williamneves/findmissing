import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar as NavbarBootstrap, Button } from 'react-bootstrap';
import { signOut, auth } from '../../lib/firebase';
import { useRecoilState } from 'recoil';
import { userAtom } from '../../atoms/contextAtom';
import toast from 'react-hot-toast';

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
			setUser(null);
		});
	};

	return (
		<NavbarBootstrap
			collapseOnSelect
			expand='lg'
			bg='dark'
			variant='dark'
			className='mb-3 shadow-sm'>
			<Container>
				<NavbarBootstrap.Brand as='span' onClick={() => navigate('/')}>
					FindMissing <i class='fa-duotone fa-person-circle-exclamation'></i>
				</NavbarBootstrap.Brand>

				<NavbarBootstrap.Toggle aria-controls='responsive-navbar-nav' />
				<NavbarBootstrap.Collapse id='responsive-navbar-nav'>
					<Nav className='me-auto'>
						<NavLink to='/postmissing' className='nav-link'>
							Post Missing
						</NavLink>
					</Nav>
					<Nav>
						{user ? (
							<div>
								<Button variant='outline-light' className='' onClick={logout}>
									Logout
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
