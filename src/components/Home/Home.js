import React from 'react'
import TopSearch from './TopSearch'
import MainPage from './MainPage'
import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/redux-hooks'
import {
    getProducts,
    getConfig,
    getDistinctFamilyAttributes,
} from '../../redux/actions/product'



const Home = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getProducts())
        dispatch(getConfig())
    }, [])

    return (
        <>
            <TopSearch />
            <MainPage />
        </>
    )
}

export default Home
