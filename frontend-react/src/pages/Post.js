import Navbar from '../components/Navbar/Navbar';
import './Post.css'
import React, { useState }  from 'react'
import axios from 'axios';


export default function Post(){

    const [selectedButton, setSelectedButton] = useState("PrivateLister");
    const [showDropdown, setShowDropdown] = useState(false);

    const handleButtonClick = (event) => {
      const button = event.target.textContent.split(" ").join("");
      setSelectedButton(button);
      console.log(button)

      if (showDropdown) {
        setShowDropdown(false);
      }

      SetInvalidUnitID(false);
      SetMissingFields(false);

      SetUnitID(null);
      setDesc(null);
      setCost(null);
      setRoomNum(null);
    };

    const [ID, setPosterID] = useState('')
    

    const handleIDChange = (event) => {
        setPosterID(event.target.value);
        if (setShowDropdown) {
            setShowDropdown(false);
        }
      };

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:3001/check-poster-id`, {
            selectedButton: selectedButton,
            ID: ID,
          })
          .then((response) => {
            console.log(response);
            const isIDFound = response.data.found;
            setShowDropdown(isIDFound);
          })
          .catch((error) => {
            console.error('Error checking ID:', error);
          });
    }

    const [UnitID, SetUnitID] = useState(null)
    const [Desc, setDesc] = useState(null)
    const [Cost, setCost] = useState(null)
    const [RoomNum, setRoomNum] = useState(null)

    const handleUnitIDChange = (e) => {
        SetUnitID(e.target.value);
        SetInvalidUnitID(false)
    }

    const handleDescChange = (e) => {
        setDesc(e.target.value);
    }

    const handleCostChange = (e) => {
        setCost(e.target.value);
    }

    const handleRoomNumChange = (e) => {
        setRoomNum(e.target.value);
        SetInvalidUnitID(false)
    }

    const [InvalidUnitID, SetInvalidUnitID] = useState(false)
    const [MissingFields, SetMissingFields] = useState(false)

    const handlePostListing = (e) => {
        e.preventDefault()
        if (!UnitID || !Desc || !Cost) {
            SetMissingFields(true)
        }
        if (UnitID && Desc && Cost) {
            SetMissingFields(false)
        }

        if (!MissingFields) {
            axios.post(`http://localhost:3001/post-private-listing`, {
                RentUnitID: UnitID,
                Desc: Desc,
                Cost: Cost,
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error('Error checking ID:', error);
                if (error.response && error.response.status === 404) {
                    console.error('Error checking ID:', error);
                    SetInvalidUnitID(true);
                }
            });
        }
    }

    const handlePostHotelListing = (e) => {
        e.preventDefault()
        if (!UnitID || !Desc || !Cost || !RoomNum) {
            SetMissingFields(true)
        }
        if (UnitID && Desc && Cost && RoomNum) {
            SetMissingFields(false)
        }

        if (!MissingFields) {
            axios.post(`http://localhost:3001/post-hotel-listing`, {
                PropertyID: UnitID,
                Desc: Desc,
                Cost: Cost,
                RoomNum: RoomNum,
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error('Error checking ID:', error);
                if (error.response && error.response.status === 404) {
                    console.error('Error checking ID:', error);
                    SetInvalidUnitID(true);
                }
            });
        }
    }

    return <>
        <div className='navbar'><Navbar/></div>

        <div className="poster-auth">
            <h1>Select your account type.</h1>
            <div className='poster-options'>
                <button className={selectedButton === 'PrivateLister' ? 'button-special' : 'button-o'}
                onClick={handleButtonClick}>
                    Private Lister
                </button>
                <button className={selectedButton === 'HotelAffiliate' ? 'button-special' : 'button-o'}
                onClick={handleButtonClick}>
                    Hotel Affiliate
                </button>
            </div>
            <h1>Enter your ID.</h1>
            <form onSubmit={handleSubmit}>
                <div className='id-input'>
                    <input type="id" placeholder='ID' className='form-control'
                    onChange={handleIDChange}/>
                </div>
                <button type="submit" className='create-post'>AUTHENTICATE</button>
            </form>
        </div>
        <div className="dropdown-main">
            {!showDropdown && (
                <h1>Please submit a valid ID.</h1>

            )}
            {showDropdown && selectedButton === "PrivateLister" && (
                <div className="dropdown-section">
                    <form onSubmit={handlePostListing}>
                        <div>
                            <h1>Enter the details of your listing.</h1>
                            <div className="listing-details">
                                
                                <input type="tel" placeholder='Rentable unit ID' onChange={handleUnitIDChange} className={InvalidUnitID ? 'invalid-input' : ''}/>
                                {InvalidUnitID && <div className="warning-message">Rentable Unit ID does not exist.</div>}
                                <input type="tel" placeholder='Description' className='description-input' onChange={handleDescChange}/>
                                <input type="tel" placeholder='Cost / night' onChange={handleCostChange} />
                                
                            </div>
                            <button type="submit" className="post-listing">POST LISTING</button>            
                            {MissingFields && <div className="warning-message">Missing fields.</div>}
                        </div>
{/*                   
                        <div className='file-upload'> file upload</div> */}
                    </form>
                </div>
            )}
            {showDropdown && selectedButton === "HotelAffiliate" && (
                <div className="dropdown-section">
                <form onSubmit={handlePostHotelListing}>
                    <div>
                        <h1>Enter the details of your listing.</h1>
                        <div className="listing-details">
                            
                            <input type="tel" placeholder='Property ID' onChange={handleUnitIDChange} className={InvalidUnitID ? 'invalid-input' : ''}/>
                            {InvalidUnitID && <div className="warning-message">Property ID or Room Number does not exist.</div>}
                            <input type="tel" placeholder='Description' className='description-input' onChange={handleDescChange}/>
                            <input type="tel" placeholder='Cost / night' onChange={handleCostChange} />
                            <input type="tel" placeholder='Room Number' onChange={handleRoomNumChange} />
                            
                        </div>
                        <button type="submit" className="post-listing">POST LISTING</button>            
                        {MissingFields && <div className="warning-message">Missing fields.</div>}
                    </div>
                </form>
            </div>
            )}
        </div>
           
    </>
}