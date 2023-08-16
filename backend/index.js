const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('./.env');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASS,
	database: process.env.DBNAME,
})

app.get('/api/PrivateListing', (req, res) => {
	let query =
		`SELECT Cost, Description, NumPeople, NumBeds, Name
         FROM PrivateListing pl,
              RentableUnit ru,
              PrivateLister l
         WHERE pl.RentableUnit_ID = ru.RentableUnit_ID
           AND ru.PrivateOrganization_ID = l.ID`;

	console.log(query);

	db.query(query, (err, results, fields) => {
		if (err) {
			return res.send(err)
		}

		console.log(fields)
		return res.json(results);
	});
});

app.get("/api/hotel-listing/:id", (req, res) => {
	let id = req.params.id;
	let query = `SELECT Cost, Description
							 FROM HotelListing hl
							 WHERE hl.HotelListing_ID = ${id}`;

	db.query(query, (err, results, fields) => {
		if (err) {
			return res.send(err);
		}
		return res.json(results);
	});
});

app.get("/api/check-customer-id/:id", (req, res) => {
	let id = req.params.id;
	let query = `SELECT *
							 FROM Customer c
							 WHERE c.ID = ${id}`;

	db.query(query, (err, results, fields) => {
		if (err) {
			return res.send(err);
		}
		console.log(results);
		return res.json(results);
	});
});

app.get("/api/reservations/hotel/:id", (req, res) => {
	let id = req.params.id;
	let query = `SELECT StartDate, Duration
							 FROM MakesReservation_1 r
							 WHERE r.BookableUnitID = ${id}`;

	db.query(query, (err, results, fields) => {
		if (err) {
			return res.send(err);
		}
		return res.json(results);
	});
});


app.get('/api/HotelListing', (req, res) => {

	let query = 'SELECT Cost, Description, NumPeople, NumBeds, Name, NumRooms \
               FROM HotelListing hl, BookableUnit bu, Property p \
               WHERE hl.Property_ID = bu.Property_ID AND hl.RoomNumber = bu.RoomNum AND bu.Property_ID = p.Property_ID'
	console.log(query)

	db.query(query, (err, results, fields) => {
		if (err) {
			return res.send(err)
		}
		console.log(fields)
		return res.json(results)
	})
})

app.get('/api/HotelListing/:minPrice/:maxPrice/:minPeople/:maxPeople/:filters', (req, res) => {
	const filters = req.params.filters;
	const minPrice = req.params.minPrice
	const maxPrice = req.params.maxPrice
	const minPeople = req.params.minPeople
	const maxPeople = req.params.maxPeople
	console.log(filters);

	let query = `SELECT HotelListing_ID, Cost, Description, Name, NumRooms, NumPeople, NumBeds \
               FROM HotelListing hl, BookableUnit bu, Property p \
               WHERE hl.Property_ID = bu.Property_ID AND hl.RoomNumber = bu.RoomNum AND bu.Property_ID = p.Property_ID 
			   AND hl.Cost >= ${minPrice} AND hl.Cost <= ${maxPrice} AND bu.NumPeople >= ${minPeople} AND bu.NumPeople <= ${maxPeople}`
	console.log(query)

	db.query(query, (err, results, fields) => {
		if (err) {
			return res.send(err)
		}
		console.log(fields)
		return res.json(results)
	})
})

app.get('/api/PrivateListing/:minPrice/:maxPrice/:minPeople/:maxPeople', (req, res) => {

	const minPrice = req.params.minPrice
	const maxPrice = req.params.maxPrice
	const minPeople = req.params.minPeople
	const maxPeople = req.params.maxPeople
	console.log(minPeople, minPrice, maxPrice, maxPeople)

	let query = `SELECT PrivateListing_ID ,Cost, Description, NumPeople, NumBeds, Name \
				FROM PrivateListing pl, RentableUnit ru, PrivateLister l \
				WHERE pl.RentableUnit_ID = ru.RentableUnit_ID AND ru.PrivateOrganization_ID = l.ID \
				AND pl.Cost >= ${minPrice} AND pl.Cost <= ${maxPrice} AND ru.NumPeople >= ${minPeople} AND ru.NumPeople <= ${maxPeople} `
	console.log(query)

	db.query(query, (err, results, fields) => {
		if (err) {
			return res.send(err)
		}
		console.log(fields)
		return res.json(results)
	})
})

app.get('/api/getAvgs/:minPeople/:maxPeople', (req, res) => {

	const minPeople = req.params.minPeople
	const maxPeople = req.params.maxPeople
	console.log(minPeople, maxPeople)

	let query = `SELECT p.Name, hl.Cost\
	FROM HotelListing hl, BookableUnit bu, Property p \
	WHERE hl.Property_ID = bu.Property_ID AND hl.RoomNumber = bu.RoomNum AND bu.Property_ID = p.Property_ID \
	GROUP BY hl.Property_ID, hl.Cost, bu.NumPeople, p.Name
	HAVING bu.NumPeople >= ${minPeople} AND bu.NumPeople <= ${maxPeople}\
	`

	//Not sure if query is correct ^

	console.log(query)

	db.query(query, (err, results, fields) => {
		if (err) {
			return res.send(err)
		}
		console.log(fields)
		return res.json(results)
	})
});

app.post("/api/hotel/add-reservation", (req, res) => {
	const { CustomerID, HotelListingID, StartDate, EndDate, Duration } = req.body;

	const query = `INSERT INTO MakesReservation_2 (StartDate, Duration, EndDate)
    					VALUES ('${StartDate}', ${Duration}, '${EndDate}')`;
	db.query(query, (err) => {
		if (err) {
			console.error('Error adding reservation:', err);
			return res.status(500).json({error: 'Error adding reservation'});
		}
		const next_id_query = `SELECT MAX(Reservation_ID) AS max_id FROM MakesReservation_1`;
		db.query(next_id_query, (err, results, fields) => {
			if (err) {
				console.error('Error getting next id:', err);
				return res.status(500).json({error: 'Error getting next id'});
			}
			const next_id = results[0].max_id + 1;
			const query = `INSERT INTO MakesReservation_1 (Reservation_ID, CustomerID, BookableUnitID, StartDate, Duration)
							VALUES (${next_id}, ${CustomerID}, ${HotelListingID}, '${StartDate}', ${Duration})`;
			db.query(query, (err, results, fields) => {
				if (err) {
					console.error('Error adding reservation:', err);
					return res.status(500).json({error: 'Error adding reservation'});
				}
				return res.json({success: true});
			});
		});
	});
});


// (3) all details for a hotel/private listing but with selection parameters (cost, num people, type) for selction feature


app.post('/check-poster-id', (req, res) => {
	const id_type = req.body.selectedButton || req.body.id_type;
	const ID = req.body.ID;

	let search_table = "";
	if (id_type === "PrivateLister" || id_type === "private") {
		search_table = "PrivateLister";
	}
	if (id_type === "HotelAffiliate" || id_type === "hotel") {
		search_table = "HotelOrganization";
	}

	if (search_table) {
		const query = `SELECT *
                       FROM ${search_table}
                       WHERE ID = ?`
		db.query(query, [ID], (err, results) => {
			if (err) {
				console.error('Error checking ID:', err);
				return res.status(500).json({error: 'Error checking ID'});
			}

			const isIDFound = results.length > 0;
			return res.json({found: isIDFound});
		});
	}
	return false;

});

app.post('/post-private-listing', (req, res) => {
		const RentUnitID = req.body.RentUnitID;
		const Desc = req.body.Desc.replaceAll(",", ";");
		const Cost = req.body.Cost;

		const checkRentableUnitQuery = `SELECT RentableUnit_ID
                                        FROM RentableUnit
                                        WHERE RentableUnit_ID = ${RentUnitID}`;
		db.query(checkRentableUnitQuery, (err, result) => {
			if (err) {
				console.error('Error checking RentableUnitID:', err);
				return res.status(500).json({error: `The RentableUnit with ID ${RentUnitID} does not exist`});
			}

			if (result.length === 0) {
				return res.status(404).json({error: `The RentableUnit with ID ${RentUnitID} does not exist`});
			}

			const queryNextID = "SELECT MAX(PrivateListing_ID) + 1 AS next_id FROM PrivateListing"

			db.query(queryNextID, (err, result) => {
				if (err) {
					console.error('Error fetching next available ID:', err);
					return res.status(500).json({error: 'Failed to get next ID'});
				}
				const nextID = result[0].next_id || 1;

				const query = `INSERT INTO PrivateListing (PrivateListing_ID, Cost, Description, RentableUnit_ID)
                               VALUES (${nextID}, ${Cost}, '${Desc}', ${RentUnitID})`

				db.query(query, (err, result) => {
					if (err) {
						console.error('Error inserting row:', err);
						return res.status(500).json({error: 'Failed to insert row'});
					}
					return res.status(200).json({message: 'Row inserted successfully!'});

				});

			});

		});

	}
)

app.post('/post-hotel-listing', (req, res) => {
		const PropertyID = req.body.PropertyID;
		const Desc = req.body.Desc.replaceAll(",", ";");
		const Cost = req.body.Cost;
		const RoomNum = req.body.RoomNum;

		const checkPropertyQuery = `SELECT Property_ID
                                    FROM Property
                                    WHERE Property_ID = ${PropertyID}`;
		db.query(checkPropertyQuery, (err, result) => {
			if (err) {
				console.error('Error checking PropertyID:', err);
				return res.status(500).json({error: `The Property with ID ${PropertyID} does not exist`});
			}

			if (result.length === 0) {
				return res.status(404).json({error: `The Property with ID ${PropertyID} does not exist`});
			}

			const checkPropertyQuery = `SELECT RoomNum
                                        FROM BookableUnit
                                        WHERE RoomNum = ${RoomNum}
                                          AND Property_ID = ${PropertyID}`;
			db.query(checkPropertyQuery, (err, result) => {
				if (err) {
					console.error('Error checking RoomNum:', err);
					return res.status(500).json({error: `The BookableUnit with Room Number ${RoomNum} is not available`});
				}

				if (result.length === 0) {
					return res.status(404).json({error: `The BookableUnit with Room Number ${RoomNum} is not available`});
				}

				const queryNextID = "SELECT MAX(HotelListing_ID) + 1 AS next_id FROM HotelListing"

				db.query(queryNextID, (err, result) => {
					if (err) {
						console.error('Error fetching next available ID:', err);
						return res.status(500).json({error: 'Failed to get next ID'});
					}
					const nextID = result[0].next_id || 1;

					const query = `INSERT INTO HotelListing (HotelListing_ID, Cost, Description, Property_ID, RoomNumber)
                                   VALUES (${nextID}, ${Cost}, '${Desc}', ${PropertyID}, ${RoomNum})`

					db.query(query, (err, result) => {
						if (err) {
							console.error('Error inserting row:', err);
							return res.status(500).json({error: 'Failed to insert row'});
						}
						return res.status(200).json({message: 'Row inserted successfully!'});

					});
				});
			});
		});
	}
)


app.post('/delete-hotel-listing', (req, res) => {
	const HotelID = req.body.HotelID;
	const PropertyID = req.body.PropertyID;
	const HotelListID = req.body.HotelListID;
	const checkHotelListingQuery = `SELECT HotelListing_ID, Property_ID, H.ID
								FROM HotelListing, HotelOrganization H
								WHERE HotelListing_ID = ${HotelListID} 
								AND Property_ID = ${PropertyID} 
								AND H.ID = ${HotelID}`;
	db.query(checkHotelListingQuery, (err, result) => {
			if (err) {
				console.error('Error checking HotelListing:', err);
				return res.status(500).json({error: `Error checking HotelListing`});
			}

			if (result.length === 0) {
				return res.status(404).json({error: `The Listing with ID ${HotelListID} does not exist,
													or belong to Property ${PropertyID}`});
			}

			const deleteHotelListing = `DELETE FROM HotelListing
										WHERE HotelListing_ID = ${HotelListID} AND Property_ID = ${PropertyID}`;
			db.query(deleteHotelListing, (err, result) => {
				if (err) {
					console.error('Error deleting row:', err);
					return res.status(500).json({error: 'Failed to delete row'});
				}
				return res.status(200).json({message: 'Row deleted successfully!'});
			});
	});
})

app.post('/delete-private-listing', (req, res) => {
	const PrivateListerID = req.body.PrivateListerID;
	const RentUnitID = req.body.RentUnitID;
	const PrivateListID = req.body.PrivateListID;

	const checkPrivateListingQuery = `SELECT PrivateListing_ID, P.RentableUnit_ID, R.PrivateOrganization_ID
								FROM PrivateListing P, RentableUnit R
								WHERE PrivateListing_ID = ${PrivateListID} 
								AND P.RentableUnit_ID = ${RentUnitID} 
								AND R.PrivateOrganization_ID = ${PrivateListerID}`;
	db.query(checkPrivateListingQuery, (err, result) => {
			if (err) {
				console.error('Error checking PrivateListing:', err);
				return res.status(500).json({error: `Error checking PrivateListing`});
			}

			if (result.length === 0) {
				return res.status(404).json({error: `The Listing with ID ${PrivateListID} does not exist,
													or belong to RentableUnit ${RentUnitID}`});
			}

			const deletePrivateListing = `DELETE FROM PrivateListing
										WHERE PrivateListing_ID = ${PrivateListID} 
										AND RentableUnit_ID = ${RentUnitID}`;
			db.query(deletePrivateListing, (err, result) => {
				if (err) {
					console.error('Error deleting row:', err);
					return res.status(500).json({error: 'Failed to delete row'});
				}
				return res.status(200).json({message: 'Row deleted successfully!'});
			});
	});
})


app.post('/update-hotel-listing', (req, res) => {
	const HotelID = req.body.HotelID;
	const PropertyID = req.body.PropertyID;
	const HotelListID = req.body.HotelListID;
	const Cost = req.body.Cost;
	const checkHotelListingQuery = `SELECT HotelListing_ID, Property_ID, H.ID
								FROM HotelListing, HotelOrganization H
								WHERE HotelListing_ID = ${HotelListID} 
								AND Property_ID = ${PropertyID} 
								AND H.ID = ${HotelID}`;
	db.query(checkHotelListingQuery, (err, result) => {
			if (err) {
				console.error('Error checking HotelListing:', err);
				return res.status(500).json({error: `Error checking HotelListing`});
			}

			if (result.length === 0) {
				return res.status(404).json({error: `The Listing with ID ${HotelListID} does not exist,
													or belong to Property ${PropertyID}`});
			}

			const updateHotelListing = `UPDATE HotelListing
										SET Cost = ${Cost}
										WHERE HotelListing_ID = ${HotelListID}`;
			db.query(updateHotelListing, (err, result) => {
				if (err) {
					console.error('Error updating row:', err);
					return res.status(500).json({error: 'Failed to updating row'});
				}
				return res.status(200).json({message: 'Row updated successfully!'});
			});
	});
})


app.post('/update-private-listing', (req, res) => {
	const PrivateListerID = req.body.PrivateListerID;
	const RentUnitID = req.body.RentUnitID;
	const PrivateListID = req.body.PrivateListID;
	const Cost = req.body.Cost;

	const checkPrivateListingQuery = `SELECT PrivateListing_ID, P.RentableUnit_ID, R.PrivateOrganization_ID
								FROM PrivateListing P, RentableUnit R
								WHERE PrivateListing_ID = ${PrivateListID} 
								AND P.RentableUnit_ID = ${RentUnitID} 
								AND R.PrivateOrganization_ID = ${PrivateListerID}`;
	db.query(checkPrivateListingQuery, (err, result) => {
			if (err) {
				console.error('Error checking PrivateListing:', err);
				return res.status(500).json({error: `Error checking PrivateListing`});
			}

			if (result.length === 0) {
				return res.status(404).json({error: `The Listing with ID ${PrivateListID} does not exist,
													or belong to RentableUnit ${RentUnitID}`});
			}

			const updatePrivateListing = `UPDATE PrivateListing
											SET Cost = ${Cost}
											WHERE PrivateListing_ID = ${PrivateListID}`;
			db.query(updatePrivateListing, (err, result) => {
				if (err) {
					console.error('Error updating row:', err);
					return res.status(500).json({error: 'Failed to update row'});
				}
				return res.status(200).json({message: 'Row updated successfully!'});
			});
	});
})

app.get('/nested-group-by', (req, res) => {
	const nestedGroupByQuery = `SELECT CustomerID, num_reservations
								FROM (
									SELECT CustomerID, COUNT(*) AS num_reservations
									FROM makesreservation_1
									GROUP BY CustomerID
								) AS subquery
								ORDER BY num_reservations DESC
								LIMIT 3`;
	db.query(nestedGroupByQuery, (err, result) => {
		if (err) {
			console.error('Error:', err);
			return res.status(500).json({error: 'Query failed'});
		}
		return res.status(200).json(result);
	});

});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
