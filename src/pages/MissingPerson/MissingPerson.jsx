import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, setDoc, db, doc, getDoc } from '../../lib/firebase';

const MissingPeople = () => {
  const [ missingPerson, setMissingPerson ] = useState( null );
  const [ loading, setLoading ] = useState( true );
	const { id } = useParams();

	// Get MissingPerson from database using the id in the url
	useEffect(() => {
		const docRef = doc(db, 'missingPersons', id);
		getDoc(docRef)
			.then((docSnap) => {
				if (docSnap.exists()) {
					console.log('Document data:', docSnap.data());
          setMissingPerson( docSnap.data() );
          setLoading( false );
				} else {
					// doc.data() will be undefined in this case
					console.log('No such document!');
				}
			})
			.catch(function (error) {
				console.log('Error getting document:', error);
			});
  }, [ id ] );
  
  if ( loading ) {
    return <div>Loading...</div>;
  }

	return (
		<>
			<div className='row'>
				<div className=' col col-lg-6 col-md-9 mx-auto mb-4'>
			<h2><i className="fa-solid fa-circle-question"></i>{missingPerson.name}, <span className='text-muted fs-6'>{missingPerson.gender}, {missingPerson.age}y</span></h2>
					<div className='card h-100 overflow-hidden rounded-3'>
						<div className='image'>
							<img
								src={missingPerson.profileIMG}
								alt={missingPerson.name}
								className='img img-responsive full-width'
							/>
						</div>
						<ul className='list-group list-group-flush'>
							<li className='list-group-item bg-light'>
								More information:
							</li>
							<li className='list-group-item'>Age: {missingPerson.age}</li>
							<li className='list-group-item'>Gender: {missingPerson.gender}</li>
							<li className='list-group-item'>
								~ {missingPerson.height} cm, ~ {missingPerson.weight} kg.
							</li>
							<li className='list-group-item d-flex justify-content-between align-items-center'>
								<span>
									<em>Last known location:</em>
									<br />
									{missingPerson.lastLocation}.
								</span>
								<a href='#' className='btn btn-primary btn-sm'>
									<i className='fa-solid fa-map-location'></i>
								</a>
							</li>
							<li className='list-group-item'>{missingPerson.moreDetails}</li>
							<li className='list-group-item'>Contact Info: </li>
							<li className='list-group-item d-flex justify-content-between align-items-center'>
								<span>You saw me?</span>
								<a href='#' className='btn btn-primary'>
									Report <i className='fa-solid fa-location-exclamation'></i>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

export default MissingPeople;
