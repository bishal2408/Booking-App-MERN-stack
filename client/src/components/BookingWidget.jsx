import React, { useContext, useEffect, useState } from 'react'
import { differenceInCalendarDays } from 'date-fns'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../context/UserContext'

const BookingWidget = ({ place }) => {
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [numberOfGuests, setNumberOfGuests] = useState(1)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [redirect, setRedirect] = useState('')

    const {user} = useContext(UserContext)
    useEffect(() => {
        if(user) {
            setName(user.name)
        }
    }, [user])

    let numberOfNights = 0
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    }

    const bookThisPlace = async () => {
        const response = await axios.post('/bookings', {
            checkIn, checkOut, numberOfGuests, name, phone,
            place: place._id, price: numberOfNights * place.price
        })
        const bookingId = response.data._id
        setRedirect(`/account/bookings/${bookingId}`)
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className='bg-white shadow p-4 ronded-2xl'>
            <div className='text-2xl text-center'>
                Price: ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className='flex'>
                    <div className='py-3 px-4'>
                        <label>Check in:</label>
                        <input type="date"
                            value={checkIn}
                            onChange={event => setCheckIn(event.target.value)} />
                    </div>
                    <div className='py-3 px-4 border-l'>
                        <label>Check out:</label>
                        <input type="date"
                            value={checkOut}
                            onChange={event => setCheckOut(event.target.value)} />
                    </div>
                </div>
                <div className='py-3 px-4 border-t'>
                    <label>Number of Guests:</label>
                    <input type="number"
                        value={numberOfGuests}
                        onChange={event => setNumberOfGuests(event.target.value)}
                        min={1} />
                </div>
                {numberOfNights > 0 && (
                    <div className='py-3 px-4 border-t'>
                        <label>Your full name:</label>
                        <input type="text"
                            placeholder='John Doe'
                            value={name}
                            onChange={event => setName(event.target.value)}
                            min={1} />

                        <label>Phone number:</label>
                        <input type="tel"
                            placeholder='9876789876'
                            value={phone}
                            onChange={event => setPhone(event.target.value)}
                            min={1} />
                    </div>
                )}
            </div>
            <button className="primary mt-4" onClick={bookThisPlace}>
                Book this place
                {numberOfNights > 0 && (
                    <span> ${numberOfNights * place.price}</span>
                )}
            </button>
        </div>
    )
}

export default BookingWidget