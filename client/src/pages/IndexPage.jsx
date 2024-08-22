import React, {useEffect, useState} from 'react'
import axios from 'axios'

const IndexPage = () => {
    const [places, setPlaces] = useState([])
    useEffect(() => {
        axios.get('/places').then(response => {
            setPlaces(response.data)
        })
    }, [])

    return (
        <div>
            {places.length > 0 && places.map(place => (
                <div key={place._id}>{place.title}</div>
            ))}
        </div>
    )
}

export default IndexPage