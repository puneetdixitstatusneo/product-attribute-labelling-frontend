import React, { useEffect, useState } from 'react'
import { Grid, Card, CardContent, TextField } from '@mui/material'
import { Button, Typography } from '@mui/material'
import { Box, Stack } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Switch from '@mui/material/Switch'

import { useAppSelector, useAppDispatch } from '../../hooks/redux-hooks'
import { updateProductAttributesAction } from '../../redux/actions/product'

function MainPage() {
    const dispatch = useAppDispatch()
    const productState = useAppSelector(state => state.productReducer)
    let productItems = []
    let productAttributes = []
    const label = { inputProps: { 'aria-label': 'Switch demo' } }

    const [selectedProduct, setselectedProduct] = useState('')
    const [productId, setProductId] =useState('')
    const [selectedProductAttributes, setSelectedProductAttributes] = useState(
        {},
    )
    const [selectedProductAttributesWithMissing, setSelectedProductAttributesWithMissing] = useState(
        {},
    )
    const [updatedProductAttributes, setUpdatedProductAttributes] = useState({})

    const [selectedFamilyConfig, setSelectedFamilyConfig] = useState({})
    const [missingChecked, setMissingChecked] = React.useState(true)



    const selectProductHandle = event => {
        setselectedProduct(event.target.textContent)
        const selectedProductIndex = productState.products
            .map(e => e.article_desc)
            .indexOf(event.target.textContent)
            
            setProductId(productState.products[selectedProductIndex]._id)

            let selectedFamilyConfig =
            productState.config[
                productState.products[selectedProductIndex].family
            ]
            setSelectedFamilyConfig(selectedFamilyConfig)
            
        let productAttributesObject = JSON.parse(
            JSON.stringify(productState.products[selectedProductIndex]),
        )

        console.log(productAttributesObject)

        let orderedProductAttributesObject = Object.keys(productAttributesObject).sort(function(a,b) { return (a.toLowerCase() < b.toLowerCase()) ? -1 : 1;}).reduce(
            (obj, key) => { 
              obj[key] = productAttributesObject[key]; 
              return obj;
            }, 
            {}
          );

        productAttributesObject = orderedProductAttributesObject
        console.log(orderedProductAttributesObject)
        
        let productRequiredAttributes = {...productAttributesObject}
        
        if ("_id" in productRequiredAttributes){
                delete productRequiredAttributes["_id"]
            }

        if ("missing_attributes" in productRequiredAttributes){
            delete productRequiredAttributes["missing_attributes"]
            }
            
        setSelectedProductAttributes(productRequiredAttributes)
        let productMissingAttributesObject = {...productRequiredAttributes}
        for (var key in selectedFamilyConfig) {
            if (
                !(
                    (
                        selectedFamilyConfig[key].name in
                        productState.products[selectedProductIndex]
                    )
                )
            ) {
                productMissingAttributesObject[
                    selectedFamilyConfig[key].name
                ] = ''
            }
        }
        console.log("productAttributesWithMissing", productMissingAttributesObject)
        setSelectedProductAttributesWithMissing(productMissingAttributesObject)
    }



    const handleProductAttributeValue = (key, value) => {
        setSelectedProductAttributesWithMissing({
            ...selectedProductAttributesWithMissing,
            [key]: value,
        })
        setUpdatedProductAttributes({
            ...updatedProductAttributes,
            [key]: value,
        })
    }

    const handleMissingCheck = event => {
        setMissingChecked(event.target.checked)
    }

    const handleUpdate = event => {

        dispatch(updateProductAttributesAction(productId, updatedProductAttributes))
        setUpdatedProductAttributes({})

    }

    if (productState && !productState.isFamilyLoading) {
        productItems = productState.products.map(item => {
            return (
                <Button
                    key={item._id}
                    onClick={selectProductHandle}
                    sx={{
                        fontSize: 15,
                        fontWeight: 'regular',
                    }}
                >
                    {item.article_desc}
                </Button>
            )
        })
    }

    productAttributes = (missingChecked == true) ? Object.entries(selectedProductAttributesWithMissing).map(
        ([key, value]) => (
            <TextField
                key={key}
                id={key}
                label={key}
                sx={{ minWidth: 250, m: 1 }}
                value={value}
                onChange={e => handleProductAttributeValue(key, e.target.value)}
            />
        ),
    ) : 
    Object.entries(selectedProductAttributes).map(
        ([key, value]) => (
            <TextField
                key={key}
                id={key}
                label={key}
                sx={{ minWidth: 250, m: 1 }}
                value={value}
                InputProps={{
                    readOnly: true,
                  }}
                onChange={e => handleProductAttributeValue(key, e.target.value)}
            />
        ),
    )
    // console.log("Product attributes text field:", productAttributes)

    // async function getMenuItems(family, attribute) {
    //     let data = {}
    //     async function fetchProducts() {
    //         try {
    //             const response = await fetch(
    //                 'http://127.0.0.1:5000/pal/products/family' +
    //                     '/' +
    //                     family +
    //                     '/' +
    //                     attribute,
    //             )
    //             const data = await response.json()
    //             console.log('Data:', data)

    //             const newMenuItems = {
    //               ...menuItems,
    //               attribute : data
    //             }
    //             setMenuItems(newMenuItems)

    //         } catch (error) {
    //             console.error('Error:', error)
    //         }
    //     }

    //     let value = fetchProducts()

    //     Object.entries(selectedProductAttributes).map(
    //       ([key, value]) => key === attribute ? (
    //          (
    //             <MenuItem name={key} key={key} value={key}>
    //                 {key}
    //             </MenuItem>
    //         )

    //   ) :
    //   (
    //     <MenuItem key = {key} value="loading">Loading</MenuItem>
    //     ))
    // }

    // productAttributes = Object.entries(selectedProductAttributes).map(
    //     ([key, value]) =>
    //         value !== '' ? (
    //             <TextField
    //                 key={key}
    //                 id={key}
    //                 label={key}
    //                 sx={{ minWidth: 250, m: 1 }}
    //                 value={value}
    //                 onChange={e =>
    //                     handleProductAttributeValue(key, e.target.value)
    //                 }
    //             />
    //         ) : (
    //             <FormControl fullWidth key={key}>
    //                 <InputLabel id="demo-simple-select-label">{key}</InputLabel>
    //                 <Select
    //                     labelId="demo-simple-select-label"
    //                     id="demo-simple-select"
    //                     value="ABCDE"
    //                     label={key}
    //                     // onChange={handleChange}
    //                 >
    //                     {getMenuItems(selectedProductAttributes.family, key)}
    //                 </Select>
    //             </FormControl>
    //         ),
    // )

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={5} md={4} lg={3}>
                <Card>
                    <CardContent>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Search"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {productItems}
                    </CardContent>
                </Card>
            </Grid>
            <Grid
                item
                xs={12}
                sm={7}
                md={8}
                lg={9}
                sx={{ display: { md: 'flex' }, justifyContent: 'center' }}
            >
                <Box sx={{ maxWidth: 800 }}>
                    <Box
                        sx={{
                            fontSize: 25,
                            fontWeight: 'bold',
                            textTransform: 'capitalize',
                            m: 1,
                        }}
                    >
                        Product Description
                    </Box>
                    <form>
                        {productAttributes}

                        {selectedProduct && (
                            <Box>
                                <Stack direction="row">
                                    <Typography
                                        sx={{
                                            m: 1,
                                            minWidth: 150,
                                            display: { md: 'flex' },
                                            justifyContent: 'center',
                                        }}
                                    >
                                        View Missing Attributes
                                    </Typography>

                                    <Switch
                                        checked={missingChecked}
                                        onChange={handleMissingCheck}
                                    />
                                </Stack>
                                { missingChecked &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        m: 2,
                                        minWidth: 150,
                                        display: { md: 'flex' },
                                        justifyContent: 'center',
                                    }}
                                    onClick={handleUpdate}
                                >
                                    Update
                                </Button>}
                            </Box>
                        )}
                    </form>
                </Box>
            </Grid>
        </Grid>
    )
}

export default MainPage
