import moment from "moment";

const initializeNewItem = (brand, date, site) => {
  return (item) => {
    let newItem = { ...item };
    // const product = products.find(product => product.itemId === item.itemId)
    const oneDayBeforeSaleDate = moment(date).utc().subtract(1, "days");
    const productionDate = oneDayBeforeSaleDate;

    const dlc = +item.dlc;

    newItem.image = null;
    newItem.itemBrand = [];
    newItem.brand = brand;
    newItem.saleDate = item.saleDate;
    newItem.availableProductionDates = [];
    newItem.productionDate = oneDayBeforeSaleDate;
    newItem.availablePackagingDates = [];
    newItem.packagingDate = oneDayBeforeSaleDate;
    newItem.dlc = dlc;
    newItem.dlcBrand = moment(dlc).diff(productionDate, "days");
    newItem.dlv = dlc;
    newItem.expectedSale = 0;
    newItem.isCopy = false;
    newItem.price = item.commercialName;
    newItem.commercialName = item.commercialName;
    newItem.site = site;

    return newItem;
  };
};

export const createProductionItemsToDispatch = (
  date,
  products,
  brand,
  user,
  siteId
) => {
  let newItems = products;

  const site = { objectId: siteId };
  const copyNewItems = [];
  for (const newItem of newItems) {
    newItem["isReusable"] = false;
    copyNewItems.push(newItem);
    const currentProduct = products.find((el) => el.id === newItem.itemId);

    if (currentProduct) {
      newItem["packaging"] = "nature";
    }
  }

  newItems = copyNewItems;

  const formatItem = initializeNewItem(brand, date, site);
  newItems = newItems.map(formatItem);

  return newItems;
};
