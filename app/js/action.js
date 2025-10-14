// format date
function formatDateForInput(dateString) {
    const months = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04",
        May: "05", Jun: "06", Jul: "07", Aug: "08",
        Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    };

    const [day, mon, yearWithTime] = dateString.split("-");
    const [year] = yearWithTime.split(" ");
    return `${year}-${months[mon]}-${day.padStart(2, "0")}`;
}
// format date



// Job Material table add row Start

const tableBody = document.querySelector("#productTable tbody");
const addRowBtn = document.getElementById("addRowBtn");

addRowBtn.addEventListener("click", async () => {
    let materilCount = document.getElementById("materilCount").innerHTML || 0;
    console.log(materilCount);

    const config = {
        appName: "fab-master-erp1",
        reportName: "All_Products",
        page: 1,
        pageSize: 200,
    };
    await ZOHO.CREATOR.API.getAllRecords(config).then(async response => {
        getProducts = await response.data;
    })
    console.log(getProducts);


    const newRow = document.createElement("tr");
    newRow.className = "bg-white border-b border-gray-200 hover:bg-gray-50";
    newRow.setAttribute("id", `rowId${materilCount}`);
    newRow.innerHTML = `
        <td id="">
            <select name="" id="rowSelect${materilCount}" class="p-[10px]">
           </select>
        </td>
        <td><input class="px-3 py-2 font-medium text-gray-900 whitespace-nowrap" type="number" name="" id=""></td>
      `;

    updateOption = newRow.children[0].children[0];
    console.log(updateOption);
    console.log(newRow.children[0].children[0]);

    updateOption.innerHTML = "<option value=''>Select</option>";
    getProducts.forEach(e => {
        updateOption.innerHTML += `<option value="${e.ID}">${e.Item_Name}</option>`
    });

    tableBody.appendChild(newRow);
    materilCount++;
});

const getStartTime = document.getElementById("Start_Time");
getStartTime.addEventListener("change", () => {
    console.log(getStartTime);
    let [hour, minute] = getStartTime.value.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert to 12-hour format

    const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")} ${ampm}`;
    console.log(formattedTime);
})

// Job Material table add row End

const updateValue = () => {
    const updateReqId = document.getElementById("Job_Request_ID");
    const updateCustomer = document.getElementById("Customer");
    const updateService = document.getElementById("Service");
    const updatePropertyName = document.getElementById("Property_Name");
    const updatePropertyNumber = document.getElementById("Property_Number");
    const updatePropertyType = document.getElementById("Property_Type");
    const updatePropertyUnit = document.getElementById("Property_Unit");
    const updateAddress = document.getElementById("Address");
    const updateZone = document.getElementById("Zone");
    const updateAccessCode = document.getElementById("Access_Code");
    const updateScheduledDate = document.getElementById("Scheduled_Date");
    const updateStartTime = document.getElementById("Start_Time");
    const updateEndTime = document.getElementById("End_Time");
    const updateCrew = document.getElementById("Crew");
    const updateDriver = document.getElementById("Driver");
    const updatePickupLocation = document.getElementById("Pickup_Location");
    const updateDropoffLocation = document.getElementById("Dropoff_Location");
    const updateSpecialInstruction = document.getElementById("Special_Instruction");
    // Get the currently selected option element
    const selectElement = document.getElementById("Crew");
    const selectElement2 = document.getElementById("Driver");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const selectedOption2 = selectElement2.options[selectElement.selectedIndex];

    // Get the value from the misspelled "vlaue" attribute
    const valueNumber = selectedOption.getAttribute("value");
    const valueNumber2 = selectedOption2.getAttribute("value");
    const setDate = updateScheduledDate.value.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatStartTime = setDate[2] + "-" + months[setDate[1] - 1] + "-" + setDate[0] + " " + updateStartTime.value;
    const formatEndTime = setDate[2] + "-" + months[setDate[1] - 1] + "-" + setDate[0] + " " + updateEndTime.value;

    const formData = {
        data: {
            Job_Id1: updateReqId.getAttribute('data'),
            Service1: updateService.getAttribute('data'),
            Crew1: valueNumber,
            Driver1: valueNumber2,
            Scheduled_Start_Time1: formatStartTime,
            Special_Instructions: updateSpecialInstruction.value,
            Scheduled_End_Time: formatEndTime,
            Customer: updateCustomer.getAttribute('data')
        }
    }
    console.log(formData);


    var config = {
        appName: "fab-master-erp1",
        formName: "Assign_Crew",
        data: formData
    }
    ZOHO.CREATOR.API.addRecord(config).then(function (response) {
        if (response.code == 3000) {
            console.log("Record added successfully");
        } else {
            console.log(response);
        }
    });
    const table = document.getElementById("productTable");
    const rows = table.querySelectorAll("tbody tr");

    const updateMaterial = {};
    rows.forEach((row) => {
        const item = row.children[0].children[0].value.trim(); // first column value
        const qty = parseFloat(row.children[1].children[0].value) || 0; // second column value

        if (!updateMaterial[item]) {
            updateMaterial[item] = { item, qty: 0 };
        }
        updateMaterial[item].qty += qty;
    });
    const materialList = Object.values(updateMaterial);
    materialList.forEach(e => {
        console.log(e);
        const newFormData = {
            data: {
                Job: updateReqId.getAttribute('data'),
                Materials: e.item,
                Qty: e.qty
            }
        }
        var config = {
            appName: "fab-master-erp1",
            formName: "Materials_Required_Job",
            data: newFormData
        }
        ZOHO.CREATOR.API.addRecord(config).then(function (response) {
            if (response.code == 3000) {
                console.log("Record added successfully");
            } else {
                console.log(response);
            }
        });
    })

    updateJobFullDetails(updateReqId.getAttribute('data'));

}
const cardAction = (val) => {
    updateJobFullDetails(val.target.closest("div").id)
}

const approvalPopup = () => {
    alert("This Booking Not Approved, Please Approve first.");
}


// Booking card Click Action 
document.getElementById("CustBookingList").addEventListener("click", async(e) => {
    console.log(e);
    
    const getCustomerId = e.target.closest(".booking-card").id;
    const cards = document.querySelectorAll('.booking-card');
    cards.forEach(card => {
        cards.forEach(e => e.classList.remove("active"));
        card.classList.add("active");
    })
    let filterBookingService = [];
    const config = {
        appName: "fab-master-erp1",
        reportName: "All_Bookings",
        criteria: `(Customer_Name == ${getCustomerId})`,
        page: 1,
        pageSize: 200,
    };
    await ZOHO.CREATOR.API.getAllRecords(config).then(async response => {
        filterBookingService = await response.data;
        console.log(response.data);
    })
    // const sortedBookings = filterBookingService.sort((a, b) =>
    //     a.Service_Type1.ID.localeCompare(b.Service_Type1.ID)
    // );
    // bookingTableDisplay(sortedBookings);
})

// Booking card Click Action