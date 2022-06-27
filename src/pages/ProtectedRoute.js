import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '../atoms/contextAtom';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = ({children}) => {
	const [user, setUser] = useRecoilState(userAtom);
	const [loading, setLoading] = React.useState(true);

	// Check if user is logged in
	useEffect(() => {
		// Check if has user in recoil state, if not, check local storage
		if (!user) {
			// Check local storage for user
			const storageUser = localStorage.getItem('user');
			// If user is in local storage, set user in recoil state
			if (storageUser) {
				setUser(JSON.parse(storageUser));
			}
		}
		setLoading(false);
	}, []);

	// If user is logged in, show the route, otherwise redirect to login page
	if (!loading) {
		if (user) {
			return children;
		}

		// Redirect to login page
		toast.error('You must be logged to access this page');
		return <Navigate to='/login' replace />;
	}
};

export default ProtectedRoute;
