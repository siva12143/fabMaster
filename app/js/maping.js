const bookingCardContainer = document.getElementById("CustBookingList");
const bookingTable = document.getElementById("bookingTableBody");
const bookingJobContainer = document.getElementById("bookingCardContainer");
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
        console.log(e);

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
            // console.log(getProperty);
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
            console.log(getBooking);

        })

        if (!addService.includes(e.Service_Type1.ID)) {
            addService.push(e.Service_Type1.ID);
            const row = document.createElement("tr");
            row.innerHTML = `<th colspan="13" ><b>${e.Service_Type1.display_value}</b></th>`;
            bookingTable.appendChild(row);
        }

        const row = document.createElement("tr");
        row.setAttribute("id", e.Parent_ID.ID);
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
            <td>${e.Preffered_Start_Time.split(" ")[1]} - ${e.Preffered_End_Time.split(" ")[1]}</td>
            <td>${getBooking[0].Status}</td>
            <td style="text-align:center;">
                <div class="Row-btn-item">Approved</div>
            </td>
            <td style="text-align:center;">
                <div class="Row-btn-item" onclick="hideShow(event)">View</div>
            </td>
        `;
        bookingTable.appendChild(row);

    })
}
const hideShow = (e) => {
    document.querySelector("#BookingSection").style.display = "none";
    document.querySelector(".jobinner").style.display = "block";
    jobPage(e.target.closest("tr").id);
}
const backToBooking = () => {
    document.querySelector("#BookingSection").style.display = "block";
    document.querySelector(".jobinner").style.display = "none";
}
const jobPage = (val) => {
    console.log(val);
    let getProperty = [];
    const config = {
        appName: "fab-master-erp1",
        reportName: "All_Bookings",
        criteria: `(ID == ${val})`,
        page: 1,
        pageSize: 200,
    };
    ZOHO.CREATOR.API.getAllRecords(config).then(response => {
        getProperty = response.data;
        displayJobCard(response.data[0], "active")
    })

}

const displayJobCard = async (Map, active) => {
    console.log(Map);

    let card = document.createElement('div');
    card.setAttribute("class", `booking-card ${active}`);
    card.setAttribute("id", Map.ID);
    card.innerHTML = `
        <div class="booking-card-header">
            <h4 title="${Map.Booking_ID} | ${Map.Customer_Name?.display_value}">
                ${Map.Booking_ID} | ${Map.Customer_Name?.display_value}
            </h4>
            <span class="">
                ${Map.Status}
            </span>
        </div>

        <ul class="bookingList-info">
            <li title="${Map.Supervisor}">
                <span class="material-symbols-outlined">map</span> Supervisor
            </li>
        </ul>
        <div class="job-requests" id="job${Map.Booking_ID}">
            <div><strong>Job Requests</strong></div>
        `;


    let getJobs = [];
    const config = {
        appName: "fab-master-erp1",
        reportName: "All_Jobs",
        criteria: `(Booking_ID == ${Map.ID})`,
        page: 1,
        pageSize: 200,
    };
    await ZOHO.CREATOR.API.getAllRecords(config).then(async response => {
        getJobs = await response.data;
        console.log(getJobs);
    })
    getJobs.forEach((e) => {
        let jobs = document.createElement("div");
        jobs.innerHTML = `
            <div class="flex items-center justify-between bg-white text-gray-700 p-3 rounded-md m-2">
                <div>
                <p class="font-semibold text-sm">${e.Start_Time.split(" ")[1]} - ${e.End_Time.split(" ")[1]}</p>
                <p class="text-sm">${e.Service_Type1}</p>
                </div>
                <div class="text-sm text-right">
                <p>Crew A</p>
                <p>Driver A</p>
                </div>
                <div class="bg-green-500 text-white p-1.5 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </div>
            </div>    
        `;
        card.appendChild(jobs)
    })
    bookingJobContainer.appendChild(card);

}