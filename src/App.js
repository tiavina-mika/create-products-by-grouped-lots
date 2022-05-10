import { groupBy, map, sumBy } from "lodash";
import moment from "moment";
import { lots, products } from "./data";
import "./styles.css";

// just to format the dlc date to human date
const lotsByDate = lots.map((l) => ({
  ...l,
  formattedDlc: moment(l.dlc).utc().format("DD/MM/YYYY")
}));

// dummy dispatchDate (11/05/22)
const dispatchDate = 1652227200000;

// the product format to send to the api
const formatProduct = (product) => {
  const productImages = product.appImage;
  const type = "SubcontractorProduct";

  return {
    itemId: product.objectId,
    itemType: type,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    name: product.name,
    commercialName: product.commercialName,
    brand: product.brand,
    uniqueCode: product.uniqueCode,
    itemBrand: product.brands || [product.brand],
    productType: product.type,
    internalTag: product.internalTag,
    image:
      Array.isArray(productImages) && productImages.length > 0
        ? productImages[0]
        : productImages,
    rating: product.rating,
    nutriscore:
      (product.nutritionInformation &&
        product.nutritionInformation.nutriscore) ||
      null,
    subcontractor:
      type === "SubcontractorProduct" && product.subcontractor
        ? product.subcontractor.name
        : null,
    price: product.price,
    foodcost: product.foodcost || product.totalCost,
    season: product.season,
    expectedProduction: product.expectedProduction,
    nationalSend: true,
    sendCapital: true,
    smallRetail: true,
    lunchbag: false
  };
};

// group lots by dlc
// so if there are 2 lots with the same dlc, we count it as 1
// but the quantity should be the sum of the their quantity
const groupedLotsByDLC = map(groupBy(lotsByDate, "dlc"), (groupedLots, key) => {
  const stockQuantity =
    groupedLots[0].orderSupplierItem.units.stock.unity.quantity;
  return {
    quantity: sumBy(groupedLots, "quantity") * stockQuantity,
    dlc: key
  };
});

// create productItems for each lot
// ex: 2 selected products and 4 lots => 4 x 2 productItems to create
const productsByLots = [];
for (const lot of groupedLotsByDLC) {
  for (const product of products) {
    productsByLots.push({
      ...product,
      dlc: lot.dlc,
      expectedProduction: lot.quantity
    });
  }
}

const brand = "FOODCHERI";
const data = {
  saleDate: dispatchDate,
  products: productsByLots.map(formatProduct),
  brand,
  user: "tiavinamika@gmail.com",
  siteId: "xxxxxxx"
};

console.log("groupedLotsByDLC", groupedLotsByDLC);
console.log("productsByLots", productsByLots);
console.log("final data", data);

// const now = moment()
// const productionDate = moment.utc(now).add(6, "days").startOf("day").valueOf()
// const dlc = moment.utc(now).add(10, "days").startOf("day").valueOf()
// const day = moment(dlc).diff(productionDate, 'days');

const App = () => {
  return (
    <div className="App">
      <h1>Create Production Items</h1>
      <ul>
        <li>A site can have multiples lots</li>
        <li>A lots should be grouped by its DLC (Date Limite Consommation)</li>
        <li>
          For each selected products, we create a production items for each lots
        </li>
      </ul>
    </div>
  );
};

export default App;
