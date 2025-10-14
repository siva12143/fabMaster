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
            let activeBook = false;
            if (i == 0) {
                bookingCard.setAttribute("class", "booking-card active");
                activeBook = true;
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
            const sortedBookings = filterBookingService.sort((a, b) =>
                a.Service_Type1.ID.localeCompare(b.Service_Type1.ID)
            );
            console.log(sortedBookings);
            if (i == 0) {
                bookingTableDisplay(sortedBookings);
            }
            i++;
        }
    });

}
const bookingTableDisplay = async (val, active) => {
    const addService = [];
    bookingTable.innerHTML = "";
    await val.forEach(async e => {
        // console.log(e);

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
            // console.log(getBooking);

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
        `;
        if (getBooking[0].Status == "Approved") {
            row.innerHTML += `
            <td style="text-align:center;">
            <div class="Row-btn-item" onclick="hideShow(event)">View</div>
            </td>`
        }
        if (getBooking[0].Status == "Draft") {
            row.innerHTML += `
            <td style="text-align:center;">
            <div class="Row-btn-item" onclick="approvalPopup()">View</div>
            </td>`
        }
        bookingTable.appendChild(row);

    })
}
const backToBooking = () => {
    document.querySelector("#BookingSection").style.display = "block";
    document.querySelector(".jobinner").style.display = "none";
}
const hideShow = (e) => {
    document.querySelector("#BookingSection").style.display = "none";
    document.querySelector(".jobinner").style.display = "block";
    jobPage(e.target.closest("tr").id);
}

const jobPage = async (val) => {
    // console.log(val);
    let getProperty = [];
    const config = {
        appName: "fab-master-erp1",
        reportName: "All_Bookings",
        criteria: `(ID == ${val})`,
        page: 1,
        pageSize: 200,
    };
    await ZOHO.CREATOR.API.getAllRecords(config).then(async response => {
        getProperty = await response.data;
        displayJobCard(response.data[0], "active")
    })
    console.log(getProperty[0].Booking_Date);
    const config2 = {
        appName: "fab-master-erp1",
        reportName: "All_Bookings",
        criteria: `(Booking_Date == "${getProperty[0].Booking_Date}")`,
        page: 1,
        pageSize: 200,
    };
    ZOHO.CREATOR.API.getAllRecords(config2).then(response => {
        console.log(response.data);
        response.data.forEach(e => {
            displayJobCard(e,"");
        })
    })

}

const displayJobCard = async (Map, active) => {
    // console.log(Map);
    let activeJob = 0;
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
        <div><strong>Job Requests</strong></div>
        <div class="job-requests" id="job${Map.Booking_ID}"></div>
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
        // console.log(getJobs);
    })
    bookingJobContainer.appendChild(card);
    let getVal = document.querySelector(`#job${Map.Booking_ID}`);
    getJobs.forEach(async (e) => {
        let getCrew = [];
        let jobs = document.createElement("div");
        jobs.setAttribute("class", "flex items-center bookingJobs justify-between bg-white text-gray-700 p-3 rounded-md m-2")
        jobs.setAttribute("id", e.ID);
        if (activeJob == 0 && active == "active") {
            updateJobFullDetails(e.ID);
            activeJob++;
        }
        try {
            const config = {
                appName: "fab-master-erp1",
                reportName: "All_Crews",
                criteria: `(Job_Id1 == ${e.ID})`,
                page: 1,
                pageSize: 200,
            };
            await ZOHO.CREATOR.API.getAllRecords(config).then(async response => {
                getCrew = await response.data || [];
                // console.log(response.data);
            })
        } catch (error) {
            console.log(error.status);
        }
        let crew = "--";
        let driver = "--";
        if (getCrew.length > 0) {
            crew = getCrew[0].Crew1.display_value;
            driver = getCrew[0].Driver1.display_value;
        }
        console.log(e);

        jobs.innerHTML = `
            <div class="w-full flex flex-wrap cursor-pointer"  id="${e.ID}" onclick="cardAction(event)">
                <p class="w-3/5 font-semibold text-sm">${e.Start_Time.split(" ")[1]} - ${e.End_Time.split(" ")[1]}</p> 
                <p class="w-1/5">${crew}</p> 
                <p class="w-1/5">${driver}</p> 
                <p class="w-3/5 text-sm">${e.Job_Name.display_value}</p>                
                <p class="w-2/5 text-sm">${e.Job_ID}</p>                
            </div>   
        `;
        getVal.appendChild(jobs)

    })

}
const updateJobFullDetails = async (jobId) => {
    console.log(jobId);
    const ReqId = document.getElementById("Job_Request_ID");
    const Customer = document.getElementById("Customer");
    const Service = document.getElementById("Service");
    const PropertyName = document.getElementById("Property_Name");
    const PropertyNumber = document.getElementById("Property_Number");
    const PropertyType = document.getElementById("Property_Type");
    const PropertyUnit = document.getElementById("Property_Unit");
    const Address = document.getElementById("Address");
    const Zone = document.getElementById("Zone");
    const AccessCode = document.getElementById("Access_Code");
    const ScheduledDate = document.getElementById("Scheduled_Date");
    const StartTime = document.getElementById("Start_Time");
    const EndTime = document.getElementById("End_Time");
    const Crew = document.getElementById("Crew");
    const Driver = document.getElementById("Driver");
    const PickupLocation = document.getElementById("Pickup_Location");
    const DropoffLocation = document.getElementById("Dropoff_Location");
    const SpecialInstruction = document.getElementById("Special_Instruction");

    ReqId.value = null;
    Customer.value = null;
    Service.value = null;
    PropertyName.value = null;
    PropertyNumber.value = null;
    PropertyType.value = null;
    PropertyUnit.value = null;
    Address.value = null;
    Zone.value = null;
    AccessCode.value = null;
    ScheduledDate.value = null;
    StartTime.value = null;
    EndTime.value = null;
    Crew.value = null;
    Driver.value = null;
    PickupLocation.value = null;
    DropoffLocation.value = null;
    SpecialInstruction.value = null;

    let Checkgrew = false;
    try {
        const cre = {
            appName: "fab-master-erp1",
            reportName: "All_Crews",
            criteria: `(Job_Id1 == ${jobId})`,
            page: 1,
            pageSize: 200,
        };
        await ZOHO.CREATOR.API.getAllRecords(cre).then(async response => {
            getCrew = await response.data;
            Checkgrew = true;
            console.log(getCrew);

        })
    } catch (error) {
        console.log(error);
    }
    if (Checkgrew == false) {

        const config = {
            appName: "fab-master-erp1",
            reportName: "All_Employees",
            page: 1,
            pageSize: 200,
        };
        await ZOHO.CREATOR.API.getAllRecords(config).then(async response => {
            getEmployee = await response.data;
        })
        Crew.innerHTML = "<option>Select</option>";
        Driver.innerHTML = "<option>Select</option>";
        PickupLocation.innerHTML = "<option>Select</option>";
        DropoffLocation.innerHTML = "<option>Select</option>";
        getEmployee.forEach(e => {
            Crew.innerHTML += `<option vlaue='${e.ID}'>${e.Name}</option>`;
            Driver.innerHTML += `<option vlaue='${e.ID}'>${e.Name}</option>`;
        });
    }
    else {
        console.log(getCrew);
        Crew.innerHTML = `<option value="${getCrew[0].Crew1.ID}">${getCrew[0].Crew1.display_value}</option>`;
        Driver.innerHTML = `<option value="${getCrew[0].Driver1.ID}">${getCrew[0].Driver1.display_value}</option>`;
        PickupLocation.innerHTML = "<option>Select</option>";
        DropoffLocation.innerHTML = "<option>Select</option>";
        const dateVal = formatDateForInput(getCrew[0].Scheduled_Start_Time1);
        console.log(dateVal);
        ScheduledDate.value = dateVal;
    }


    const config = {
        appName: "fab-master-erp1",
        reportName: "All_Jobs",
        criteria: `(ID == ${jobId})`,
        page: 1,
        pageSize: 200,
    };
    await ZOHO.CREATOR.API.getAllRecords(config).then(async response => {
        getJob = await response.data;
    })
    console.log(getJob);

    const config2 = {
        appName: "fab-master-erp1",
        reportName: "All_Booking_Line_Items",
        criteria: `(Parent_ID == ${getJob[0].Booking_ID.ID})`,
        page: 1,
        pageSize: 200,
    };
    await ZOHO.CREATOR.API.getAllRecords(config2).then(async response => {
        getBooking = await response.data;
    })
    console.log(getBooking);


    const config3 = {
        appName: "fab-master-erp1",
        reportName: "All_Properties",
        criteria: `(ID == ${getBooking[0].Property_Name.ID})`,
        page: 1,
        pageSize: 200,
    };
    await ZOHO.CREATOR.API.getAllRecords(config3).then(async response => {
        getProperty = await response.data;
    })
    console.log(getProperty);

    ReqId.value = getJob[0].Job_ID;
    ReqId.setAttribute("data", getJob[0].ID);
    Service.value = getJob[0].Job_Name.display_value;
    Service.setAttribute("data", getJob[0].Job_Name.ID);
    Customer.value = getBooking[0].Customer.display_value;
    Customer.setAttribute("data", getBooking[0].Customer.ID);
    PropertyName.value = getProperty[0].Property_Name;
    PropertyNumber.value = getProperty[0].Property_Number;
    PropertyType.value = getProperty[0].Property_Type;
    PropertyUnit.value = getProperty[0].Bhk_Type.display_value;
    Zone.value = getProperty[0].Zone.display_value;
    AccessCode.value = getProperty[0].Number_of_Access_Cards_Keys;
}