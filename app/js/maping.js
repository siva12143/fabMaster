const bookingCardContainer = document.getElementById("CustBookingList");
const bookingTable = document.getElementById("bookingTableBody");
const mapping = async (cust, book, bookline, jobs) => {

    let i = 0;
    cust.forEach(e => {
        // console.log(e.Customer_Name);

        // console.log(bookline);
        const filterBooking = book.filter(obj => obj.Customer_Name.ID == e.ID);

        const bookingID = filterBooking.map(booking => booking.ID);

        const filterBookingService = bookline.filter(booking =>
            bookingID.includes(booking.Parent_ID?.ID)
        );

        if (filterBooking.length > 0) {
            const bookingCard = document.createElement("div");
            bookingCard.setAttribute("id", e.ID);
            if (i == 0) {
                bookingCard.setAttribute("class", "booking-card active");
            }
            else {
                bookingCard.setAttribute("class", "booking-card");
            }
            bookingCard.innerHTML = `
                <div class="booking-card-header">
                    <h4 title="${e.Customer_Name}">
                        ${e.Customer_Name}
                    </h4>
                </div>
    
                <ul class="bookingList-info">
                    <li title="${filterBooking[0]?.Supervisor || "No Supervisor"}">
                        <span class="material-symbols-outlined">person</span> ${filterBooking[0]?.Supervisor || "No Supervisor"}
                    </li>
                    <li title="${e.ID}">
                        <span class="">${filterBooking.length}</span> Booking
                    </li>
                    <li title="${e.ID}">
                        <span class="">${filterBookingService.length}</span> Service
                    </li>
                </ul>
            `;
            bookingCardContainer.appendChild(bookingCard);
            i++;
            const sortedBookings = filterBookingService.sort((a, b) =>
                a.Service_Type1.ID.localeCompare(b.Service_Type1.ID)
            );
            bookingTableDisplay(sortedBookings);
        }
    });

}
const bookingTableDisplay = async (val) => {
    const addService = [];

    await val.forEach(async e => {
        let getProperty = [];
        const config = {
            appName: "fab-master-erp1",
            reportName: "All_Properties",
            criteria: `(ID == ${e.Property_Name.ID})`,
            page: 1,
            pageSize: 200,
        };
        await ZOHO.CREATOR.API.getAllRecords(config).then(async response => {
            getProperty = await response.data;
            console.log(getProperty);
        })

        let getBooking = [];
        const config2 = {
            appName: "fab-master-erp1",
            reportName: "All_Bookings",
            criteria: `(ID == ${e.Parent_ID.ID})`,
            page: 1,
            pageSize: 200,
        };
        await ZOHO.CREATOR.API.getAllRecords(config2).then(async response => {
            getBooking = await response.data;
        })

        if (!addService.includes(e.Service_Type1.ID)) {
            addService.push(e.Service_Type1.ID);
            const row = document.createElement("tr");
            row.innerHTML = `<th colspan="13" ><b>${e.Service_Type1.display_value}</b></th>`;
            bookingTable.appendChild(row);
        }
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" /></td>
            <td>${e.Parent_ID.display_value}</td>
            <td>${e.BHK_Type.display_value}</td>
            <td>${e.Property_Name.display_value}</td>
            <td>${getProperty[0]?.Property_Number}</td>
            <td>${e.Frequency}</td>
            <td>${e.Days}</td>
            <td>${getBooking[0]?.Start_Date}</td>
            <td>${getBooking[0]?.End_Date}</td>
            <td>${getBooking[0]?.Preffered_Start_Time}</td>
            <td>${e.Status}</td>
            <td style="text-align:center;">
                <div class="Row-btn-item">Create</div>
            </td>
            <td style="text-align:center;">
                <div class="Row-btn-item" onclick="runTable(event)">View</div>
            </td>
        `;
        bookingTable.appendChild(row);

    })
}