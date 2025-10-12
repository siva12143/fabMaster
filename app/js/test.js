
const runTable = (e) => {
    const bookingID = e.target.closest('tr').id;
    getJob(bookingID)
    jobleftCont(e)
    document.querySelector("#BookingSection").style.display = "none";
    document.querySelector(".JobOverviewInner").style.display = "block";
}
const getJob = async (bookingId) => {
    console.log(bookingId);
    Config_Services = {
        appName: "fab-master-erp1",
        reportName: "All_Jobs",
        criteria: `(Booking_ID == ${bookingId})`,
        page: 1,
        pageSize: 200,
    };
    // console.log(Config_Services, 'Config_Services');

    await ZOHO.CREATOR.API.getAllRecords(Config_Services).then(async response => {
        await response.data.forEach(e => {
            OpenJOBDetails(e.ID);
        });
    });
}
const backToBooking = () => {
    document.querySelector("#BookingSection").style.display = "block";
    document.querySelector(".JobOverviewInner").style.display = "none";
}

const jobleftCont = (bookingId) => {
    const config_BK = {
    appName: "fab-master-erp1",
    reportName: "All_Bookings",
    criteria: `(ID == ${bookingId || ""})`,
    page: 1,
    pageSize: 200,
  };

  let CustBookingList = document.getElementById("CustBookingList");
  let customerBooking = document.getElementById("bookingCardContainer");

  console.log(customerBooking,"customerBooking");
  
  ZOHO.CREATOR.API.getAllRecords(config_BK).then(response => {
    let bookings = response.data || [];
    // Group by Customer
    let customerMap = {};
    bookings.forEach(bk => {
        console.log(bk,"bk");

  customerBooking.innerHTML = ""; // Clear existing cards
      document.getElementById("ShowCustName").innerText = bk.Customer_Name?.display_value;
      let BKCard = `
      <div class="booking-card active" data-id="${bk.ID}">
        <div class="booking-card-header">
          <h4 title="${bk.Booking_ID} | ${bk.Customer_Name?.display_value}">
            ${bk.Booking_ID} | ${bk.Customer_Name?.display_value}
          </h4>
          <span class="status status-status-${(bk.Status || "").toLowerCase()}">
            ${bk.Status || ""}
          </span>
        </div> 

        <ul class="bookingList-info">
          <li title="${bk.Supervisor}">
            <span class="material-symbols-outlined">person</span>${bk.Supervisor || "Not Assigned "}
          </li>
        </ul>
        <div class="job-requests">
          <div><strong>Job Requests</strong></div>
          <div class="job-requestInner"></div>
        </div>
      </div>`;
    // console.log(BKCard,"BKC");
    
    // insert card into DOM first
   let temp = document.createElement("div");
    temp.innerHTML = BKCard.trim();  // put your string inside
    customerBooking.appendChild(temp.firstChild);

    let newCard = document.querySelector(`.booking-card[data-id="${bk.ID}"]`);
    console.log(newCard,"newCard");
    
    let JobRec = newCard.querySelector(".job-requestInner");
      // fetch Jobs
        Config_Services = {
        appName: "fab-master-erp1",
        reportName: "All_Jobs",
        criteria: `(Booking_ID == ${bk.ID})`,
        page: 1,
        pageSize: 200,
        };
    // console.log(Config_Services, 'Config_Services');

    ZOHO.CREATOR.API.getAllRecords(Config_Services).then(response => {

      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        response.data.forEach(service => {
          // console.log(service,"Config_Services");
          
          let serviceDiv = document.createElement("div");
          serviceDiv.innerHTML = `
        <span>
         ${service.Job_Name?.display_value || ""} 
         ${service.Start_Time.split(" ")[1] || ""} - ${service.End_Time.split(" ")[1] || ""} | 
           &nbsp; | ${service.Assigned_To || "Not Assigned"} | ${service.Driver_Assigned || "Not Assigned"}
        </span>`;
          JobRec.appendChild(serviceDiv);
          // console.log(serviceDiv);
          
        });
      } else {
        // no service data → show placeholder
        let emptyDiv = document.createElement("div");
        emptyDiv.innerHTML = `<span>No Job Request</span>`;
        JobRec.appendChild(emptyDiv);
        // console.log(emptyDiv);
        
      }
    });



      let custName = bk.Customer_Name?.display_value || "Unknown Customer";
      let custId = bk.Customer_Name?.ID || bk.ID;
      let supervisor = bk.Supervisor || "No Supervisor";
      let Booking_ID = bk.Booking_ID;

      if (!customerMap[custName]) {
        customerMap[custName] = {
          id: custId,
          bookings: 0,
          BKID: Booking_ID,
          services: new Set(),
          supervisor: supervisor
        };
      }

      customerMap[custName].bookings += 1;

      if (bk.Supervisor) {
        customerMap[custName].supervisor = bk.Supervisor;
      }

      if (Array.isArray(bk.Service_Details)) {
        bk.Service_Details.forEach(svc => {
          if (svc.display_value) {
            customerMap[custName].services.add(svc.display_value.trim());
          }
        });
      }
    });

    // Render cards
    CustBookingList.innerHTML = "";
    let firstCard = null;

    Object.keys(customerMap).forEach((custName, index) => {
      let cust = customerMap[custName];

      let card = document.createElement("div");
      card.classList.add("booking-card");
      card.style.borderRadius = "4px";

      card.innerHTML = `
        <h4>${custName}</h4>
        <ul class="bookingList-info">
          <li title="${cust.supervisor}">
            <span class="material-symbols-outlined">account_circle</span>
            <span style="text-overflow: ellipsis;overflow: hidden;font-size:10px">${cust.supervisor}</span>
          </li>
          <li><span style="font-size: 10px;">${cust.bookings}</span><span style="font-size: 10px;">Bookings</span></li>
          <li><span style="font-size: 10px;">${cust.services.size}</span><span style="font-size: 10px;">Service</span></li>
        </ul>
      `;

      // Attach click event
      card.addEventListener("click", function () {
        // Remove 'active' class from all cards
        document.querySelectorAll('.booking-card').forEach(c => c.classList.remove('active'));

        // Add 'active' to clicked card
        card.classList.add('active');

        // Load booking details
        loadBookingDetails(cust.id);
        // console.log(cust, "console");

        loadJobsDetails(cust.id)
      });

      if (index === 0) {
        firstCard = card;
      }

      CustBookingList.appendChild(card);
    });

    // Automatically click the first card
    if (firstCard) {
      firstCard.click();
    }

  });
}
jobleftCont("")