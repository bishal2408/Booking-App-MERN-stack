import React, { useEffect, useState } from 'react'
import Perks from '../components/Perks'
import axios from 'axios'
import PhotosUploader from '../components/PhotosUploader'
import { Navigate, useParams } from 'react-router-dom'
import AccountNav from '../components/AccountNav'

const PlacesFormPage = () => {
    const { id } = useParams()

    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([])
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)
    const [price, setPrice] = useState(100)
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then(response => {
            const { data } = response
            setTitle(data.title)
            setAddress(data.address)
            setAddedPhotos(data.photos)
            setDescription(data.description)
            setPerks(data.perks)
            setExtraInfo(data.extraInfo)
            setCheckIn(data.checkIn)
            setCheckOut(data.checkOut)
            setMaxGuests(data.maxGuests)
            setPrice(data.price)
        })
    }, [id])

    const inputHeader = (text) => {
        return (
            <h2 className='text-2xl mt-4'>{text}</h2>
        )
    }

    const inputDescription = (description) => {
        return (
            <p className='text-gray-500 text-sm'>{description}</p>

        )
    }

    const preInput = (text, description) => {
        return (
            <>
                {inputHeader(text)}
                {inputDescription(description)}
            </>
        )
    }

    const savePlace = async (event) => {
        event.preventDefault()
        const placeData = {
            title, address, addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests, price
        }
        if (id) {
            // update
            await axios.put('/places/', { id, ...placeData })
            setRedirect(true)

        } else {
            // new place
            await axios.post('/places', placeData)
            setRedirect(true)

        }
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }
    return (
        <div>
            <AccountNav />
            <form onSubmit={savePlace}>
                {preInput('Title', 'Title for your place should be short and catchy as in advertisement')}
                <input type="text"
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder='title, for example: My lovely apartment' />

                {preInput('Address', 'Address to this place')}
                <input type="text"
                    value={address}
                    onChange={event => setAddress(event.target.value)}
                    placeholder='address' />
                {preInput('Photos', 'more = better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

                {preInput('Description', 'Description of the place')}
                <textarea value={description}
                    onChange={event => setDescription(event.target.value)} />

                {preInput('Perks', 'Select all the perks of your place')}
                <div className='grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:md-cols-6'>
                    <Perks selected={perks} onChange={setPerks} />
                </div>

                {preInput('Extra Info', 'house rules, etc')}
                <textarea value={extraInfo}
                    onChange={event => setExtraInfo(event.target.value)} />

                {preInput('Check in&out time', 'add check in and out times, remember to have some time window for cleaning the room between guests')}
                <div className='grid gap-2 grid-cols-2 md:grid-cols-4'>
                    <div>
                        <h3 className='mt-2 -mb-1'>Check in time</h3>
                        <input type="text"
                            value={checkIn}
                            onChange={event => setCheckIn(event.target.value)}
                            placeholder='14' />
                    </div>
                    <div>
                        <h3 className='mt-2 -mb-1'>Check out time</h3>
                        <input type="text"
                            value={checkOut}
                            onChange={event => setCheckOut(event.target.value)}
                            placeholder='11' />
                    </div>
                    <div>
                        <h3 className='mt-2 -mb-1'>Max number of guests</h3>
                        <input type="Number"
                            value={maxGuests}
                            onChange={event => setMaxGuests(event.target.value)} />
                    </div>
                    <div>
                        <h3 className='mt-2 -mb-1'>Price per night</h3>
                        <input type="Number"
                            value={price}
                            onChange={event => setPrice(event.target.value)} />
                    </div>
                </div>

                <button className='primary my-4'>Save</button>

            </form>
        </div>
    )
}

export default PlacesFormPage