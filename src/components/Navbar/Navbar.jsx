import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar as NavbarBootstrap, Button } from 'react-bootstrap';
import { signOut, auth } from '../../lib/firebase';
import { useRecoilState } from 'recoil';
import { userAtom } from '../../atoms/contextAtom';
import toast from 'react-hot-toast';

const Navbar = () => {
	const [user, setUser] = useRecoilState(userAtom);

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
				<Link to='/' className='text-decoration-none'>
					<NavbarBootstrap.Brand as='span'>FindMissing</NavbarBootstrap.Brand>
				</Link>

				<NavbarBootstrap.Toggle aria-controls='responsive-navbar-nav' />
				<NavbarBootstrap.Collapse id='responsive-navbar-nav'>
					<Nav className='me-auto'>
						<Link to='/postmissing' className='text-decoration-none'>
							<Nav.Link as='span'>Post Missing</Nav.Link>
						</Link>
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
								<Link to='/login'>
									<Button variant='outline-light' className='me-3 mb-2 mb-lg-0'>
										Login
									</Button>
								</Link>
								<Link to='/register'>
									<Button variant='outline-light'>Register</Button>
								</Link>
							</React.Fragment>
						)}
					</Nav>
				</NavbarBootstrap.Collapse>
			</Container>
		</NavbarBootstrap>
	);
};

export default Navbar;
