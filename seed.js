let Hamoni = require("hamoni-sync");

let hamoni = new Hamoni("AccountID", "APP_ID");

hamoni
  .connect()
  .then(response => {
    hamoni
      .createList("datagrid", [
        { firstName: "James", lastName: "Darwin" },
        { firstName: "Jimmy", lastName: "August" }
      ])
      .then(() => console.log("create success"))
      .catch(error => console.log(error));
  })
  .catch(error => console.log(error));
