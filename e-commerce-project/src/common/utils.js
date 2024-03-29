export const getUniqueElementArray = (arr, property) => {
  return arr.reduce(
    (acc, item) =>
      acc.includes(item[property]) ? acc : [...acc, item[property]],
    []
  );
};

export const getImgUrl = (category) => {
  switch (category) {
    case "shoes":
      return "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    case "clothing":
      return "https://images.pexels.com/photos/1163194/pexels-photo-1163194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    case "accessories":
      return "https://images.pexels.com/photos/4019460/pexels-photo-4019460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    default:
      return "https://images.pexels.com/photos/1163194/pexels-photo-1163194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  }
};

export const getItemFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};

export const isEmptyObject = (obj) =>
  Object.values(obj).some((el) => el === "");

export const clearItemsFromCart = async (productId, token, isLoggedIn) => {
  if (isLoggedIn) {
    try {
      const response = await fetch(`/api/user/cart/${productId}`, {
        method: "DELETE",
        headers: {
          authorization: token,
        },
      });
      const data = response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
};
