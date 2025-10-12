const mapping = async (cust, book, bookline, jobs) => {
    // card View Based Customer

    cust.forEach(e => {
        console.log(e.ID, e.Customer_Name);
        // console.log(bookline);
        const filterBooking = book.filter(obj => obj.Customer_Name.ID == e.ID);

        const bookingID = filterBooking.map(booking => booking.ID);
        console.log(bookingID);

        const filterBookingService = bookline.filter(booking =>
            bookingID.includes(booking.Parent_ID?.ID)
        );
        console.log(filterBookingService);
    });

}
