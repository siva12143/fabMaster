let getAllBoking = [];

ZOHO.CREATOR.init().then(async function () {

    /**
     * A reusable async function to fetch all records from a report,
     * automatically handling pagination.
     * @param {string} reportName - The API name of the report to fetch.
     * @returns {Promise<Array>} A promise that resolves with an array of all records.
     */
    const fetchAllRecords = async (reportName) => {
        let allRecords = [];
        let pageCount = 1;
        let hasMoreRecords = true;

        while (hasMoreRecords) {
            const config = {
                appName: "fab-master-erp1",
                reportName: reportName,
                page: pageCount,
                pageSize: 200,
            };

            // Use 'await' to pause execution until the API call is complete
            const response = await ZOHO.CREATOR.API.getAllRecords(config);
            
            if (response.data && response.data.length > 0) {
                allRecords.push(...response.data); // More efficient way to add items
            }

            // If we get less than 200 records, it's the last page
            if (response.data.length < 200) {
                hasMoreRecords = false;
            } else {
                pageCount++; // Go to the next page
            }
        }
        return allRecords;
    };

    // --- Main Execution ---

    console.log("Starting to fetch all data...");

    // Use Promise.all to run all fetch operations in parallel for speed.
    // The code will wait here until ALL data has been successfully fetched.
    var [allBooking, bookingLineItems, allJObs, allCustomer] = await Promise.all([
        fetchAllRecords("All_Bookings"),
        fetchAllRecords("All_Booking_Line_Items"),
        fetchAllRecords("All_Jobs"), // Corrected from the original code which fetched Line Items twice
        fetchAllRecords("All_Customers")
    ]);
    
    console.log("All data has been fetched successfully!");
    console.log(`Total Bookings: ${allBooking.length}`);
    console.log(`Total Line Items: ${bookingLineItems.length}`);
    console.log(`Total Jobs: ${allJObs.length}`);
    console.log(`Total Customers: ${allCustomer.length}`);
    
    // Now it's safe to call your function because you have awaited all the data.
    mapping(allCustomer, allBooking, bookingLineItems, allJObs); // You can pass all the data now

});
