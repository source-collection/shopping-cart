import { Box, Container, Grid, makeStyles, Paper } from '@material-ui/core'
import productApi from 'api/productApi'
import ProductSkeletonList from 'features/Product/components/ProductSkeletonList'
import React, { useEffect, useState } from 'react'
import ProductList from '../components/ProductList'
import ProductPagination from '../components/ProductPagination'

const useStyles = makeStyles((theme) => ({
  root: {},
  left: {
    width: '250px'
  },
  right: {
    flex: '1 1 0'
  }
}))

export default function ListPage(props) {
  const classes = useStyles()

  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    _page: 1,
    _limit: 12
  })
  const [pagination, setPagination] = useState({
    limit: 12,
    total: 10,
    page: 1
  })

  useEffect(() => {
    try {
      const fetchProductList = async () => {
        const response = await productApi.getAll(filters)
        const { data, pagination } = response

        setProductList(data)
        setPagination(pagination)
        setLoading(false)
      }

      fetchProductList()
    } catch (error) {
      console.log('Failed to fetch product list: ', error)
    }
  }, [filters])

  const handlePageChange = (e, page) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      _page: page
    }))
  }

  return (
    <Box>
      <Container>
        <Grid container spacing={1}>
          <Grid className={classes.left} item>
            <Paper elevation={0}>Left</Paper>
          </Grid>
          <Grid className={classes.right} item>
            <Paper elevation={0}>
              {loading ? (
                <ProductSkeletonList length={10} />
              ) : (
                <ProductList productList={productList} />
              )}
              <ProductPagination
                count={Math.ceil(pagination.total / pagination.limit)}
                page={pagination.page}
                onPageChange={handlePageChange}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}