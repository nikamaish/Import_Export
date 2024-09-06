const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// weight is in kg, volume is in cubic meters, on searates site weight is in metric tons
// from and to are coordinates of the cities (latitude and longitude)

const query = `
{
  shipment: lcl(
    from: [49.4924, 0.1064]  
    to: [-33.9180, 18.4216]    
    currency: USD
    weight: 1500
    volume: 20
  ) {
    shipmentId
    transportationMode
    currency
    cityFrom: city(mode: EXPORT) {
      id
      name
      code
      countryCode
      lat
      lng
    }
    cityTo: city(mode: IMPORT) {
      id
      name
      code
      countryCode
      lat
      lng
    }
    portFrom: port(mode: EXPORT) {
      id
      name
      code
      countryCode
      lat
      lng
    }
    portTo: port(mode: IMPORT) {
      id
      name
      code
      countryCode
      lat
      lng
    }
    oceanFreight {
      shippingLine
      logo
      price
      distance
      comment
      originalPrice
      originalCurrency
      overdue
      co2
    }
  }
}
`;

const apiEndpoint = 'https://www.searates.com/graphql_rates';
const headers = {
  'Authorization': `Bearer ${process.env.SEARATES_API_KEY}`,
  'Content-Type': 'application/json',
};

app.get('/rate', async (req, res) => {
  try {
    const response = await axios.post(apiEndpoint, { query }, { headers }); // sending a POST request to the API with the query and headers
    const data = response.data;

    if (data.errors) {
      console.error('API Errors:', data.errors);
      return res.status(500).send('Error fetching data from API');
    }

    const shipmentData = data?.data?.shipment;
    if (shipmentData && shipmentData.length > 0) {
      const rate = shipmentData[0]?.oceanFreight?.price;
      console.log('Rate:', rate);
      res.send(`Rate: ${rate}`);
    } else {
      console.log('No shipment data found.');
      res.send('No shipment data found.');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error fetching data.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});