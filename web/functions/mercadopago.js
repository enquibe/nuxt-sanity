/* eslint-disable no-console */

import { configure, preferences } from "mercadopago"

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
}

export async function handler(event, context) {
  // CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers
    }
  }

  if (!event.body || event.httpMethod !== "POST") {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: "invalid http method"
      })
    }
  }

  const data = JSON.parse(event.body)
  console.log(data)

  if (!data.items) {
    console.error("List of items to purchase is missing.")

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: "missing information"
      })
    }
  }

  // TODO: validar desde la bd los precios de los productos
  const preference = {
    items: [
      {
        id: "1234",
        title: "Mi producto",
        quantity: 1,
        currency_id: "ARS",
        unit_price: 100
      }
    ],
    back_urls: {
      success: "https://www.tu-sitio/success",
      failure: "http://www.tu-sitio/failure",
      pending: "http://www.tu-sitio/pending"
    },
    auto_return: "approved"
  }

  try {
    configure({
      // eslint-disable-next-line prettier/prettier
      access_token: "TEST-7614602994394127-052503-ed776271d406bf29ae5def660cfd09d2-183679510"
    })

    const {
      body: { init_point }
    } = await preferences.create(preference)
    console.log(init_point)
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: err
      })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(init_point)
  }
}
