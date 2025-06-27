const fetch = require('node-fetch');

async function testFeaturedProducts() {
  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            featuredProducts {
              _id
              name
              price
              isFeatured
              category {
                name
              }
              brand {
                name
              }
            }
          }
        `
      })
    });

    const data = await response.json();
    console.log('Featured Products Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.data && data.data.featuredProducts) {
      console.log(`\nFound ${data.data.featuredProducts.length} featured products:`);
      data.data.featuredProducts.forEach(product => {
        console.log(`- ${product.name} (${product.brand?.name || 'No brand'}) - $${product.price}`);
      });
    }
  } catch (error) {
    console.error('Error testing GraphQL:', error);
  }
}

testFeaturedProducts(); 