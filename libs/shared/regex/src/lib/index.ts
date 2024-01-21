export const regex = {
  email: new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ),
  link: new RegExp(/^https?:\/\/[^\s$.?#].[^\s]*$/),
  imageUrl: new RegExp(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))$/i),
};
