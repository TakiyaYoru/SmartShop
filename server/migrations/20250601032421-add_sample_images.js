export const up = async (db, client) => {
  // Cập nhật products với sample images
  await db.collection("products").updateMany(
    {},
    {
      $set: {
        images: [
          "/img/placeholder-product.jpg"
        ]
      }
    }
  );
};

export const down = async (db, client) => {
  await db.collection("products").updateMany(
    {},
    {
      $unset: {
        images: ""
      }
    }
  );
};