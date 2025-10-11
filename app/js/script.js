var config = {
  app_name: "fab-master-erp1",
  report_name: "All_Bookings"
};
ZOHO.CREATOR.DATA.getRecords(config).then(function (response) {
  console.log(response.data);
});