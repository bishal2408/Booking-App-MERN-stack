import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Perks from '../components/Perks'
import axios from 'axios'

const PlacesPage = () => {
    const { action } = useParams()
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([])
    const [photoLink, setPhotoLink] = useState('')
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)

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

    const addPhotoByLink = async (event) => {
        event.preventDefault()
        const { data: filename } = await axios.post('upload-by-link', { link: photoLink })
        setAddedPhotos(prev => {
            return [...prev, filename]
        })
        setPhotoLink('')
    }

    const uploadPhoto = (event) => {
        const files = event.target.files
        const data = new FormData()
        for(let i=0; i < files.length ; i++) {
            data.append('photos', files[i])
        }
        axios.post('/upload', data, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(response => {
            const {data:filenames} = response
            setAddedPhotos(prev => {
                return [...prev, ...filenames]
            })
        })
    }

    return (
        <div>
            {action !== 'new' && (
                <div className='text-center'>
                    <Link className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full' to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new place
                    </Link>
                </div>
            )}

            {action === 'new' && (
                <div>
                    <form>
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
                        <div className='flex gap-2'>
                            <input type="text"
                                value={photoLink}
                                onChange={event => setPhotoLink(event.target.value)}
                                placeholder='Add using a link........jpg' />
                            <button onClick={addPhotoByLink} className='bg-gray-200 px-4 rounded-2xl'>Add&nbsp;Photo</button>
                        </div>

                        <div className='mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
                            {addedPhotos.length > 0 && addedPhotos.map((link, index) => (
                                <div key={index} className='h-32 flex'>
                                    <img className='rounded-2xl w-full object-cover' src={'http://localhost:5555/uploads/' + link} />
                                </div>
                            ))}
                            <label className='flex items-center gap-1 justify-center cursor-pointer border bg-transparent rounded-2xl p-2 text-2xl text-gray-600 h-32'>
                                <input type="file" multiple style={{ display: 'none' }} onChange={uploadPhoto} />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                </svg>
                                Upload
                            </label>
                        </div>

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
                        <div className='grid gap-2 sm:grid-cols-3'>
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
                        </div>

                        <button className='primary my-4'>Save</button>

                    </form>
                </div>
            )}
        </div>
    )
}

export default PlacesPage