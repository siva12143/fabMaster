let AllBookings = [];
let AllJobs = [];
let AllBookingDates = [];
let AllServices = [];
ZOHO.CREATOR.init().then(function () {
  var initparams = ZOHO.CREATOR.UTIL.getInitParams();
  let modal = document.getElementById("bookingFormModal");
  let modal2 = document.getElementById("bookingFormModal1");
  let zohoFormContainer = document.getElementById("zohoForm");
  let zohoFormContainer2 = document.getElementById("zohoForm2");
  // Booking button
  let openBookingBtn = document.getElementById("openFormBtn");
  openBookingBtn.onclick = () => {
    zohoFormContainer.innerHTML = `
    <span class="material-symbols-outlined close" data-target="bookingFormModal">close</span>
    <iframe 
      height="500px" 
      width="100%" 
      frameborder="0" 
      allowTransparency="true" 
      scrolling="auto" 
      src="https://creatorapp.zohopublic.com/fabmastermiddleeast/fab-master-erp1/form-embed/Booking/G4GzKdnThZvdxvfxQd1wqRTs6SU2rGzXkzWfwPjhNMk7JVrTUrq6zPy6r01BS5QW66sQFs2Nd1SSf4BZZOD2O22ZVjRTuuxpdq7O?data=${initparams.loginUser}">
    </iframe>
  `;
    modal.style.display = "block";
    bindClose();
  };

  // Job button
  let openJobBtn = document.getElementById("openJobFormBtn");
  openJobBtn.onclick = () => {
    zohoFormContainer2.innerHTML = `
    <span class="material-symbols-outlined close" data-target="bookingFormModal1">close</span>
    <iframe 
      height="500px" 
      width="100%" 
      frameborder="0" 
      allowTransparency="true" 
      scrolling="auto" 
      src="https://creatorapp.zohopublic.com/fabmastermiddleeast/fab-master-erp1/form-embed/Job/z8depjKtHb8pSEXaOVTK1TwA3ppGpPHxUsFB994nDFNU5d7h1XZ7FhJswsn6F7kSWKDekPdsBBg4H8Xm6bXeRbPN5WhAOMdNw1AW">
    </iframe>
  `;
    modal2.style.display = "block";
    bindClose();
  };

  // Close logic
  function bindClose() {
    document.querySelectorAll(".close").forEach(btn => {
      btn.onclick = () => {
        let targetId = btn.getAttribute("data-target");
        document.getElementById(targetId).style.display = "none";
      };
    });
  }

  // Close when clicking outside modal
  window.onclick = (e) => {
    if (e.target == modal) modal.style.display = "none";
    if (e.target == modal2) modal2.style.display = "none";
  };



  const config_BK = {
    appName: "fab-master-erp1",
    reportName: "All_Bookings",
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
        
      // AllBookingDates.push(bk.Booking_Date);
      // console.log(AllBookingDates, 'booking');
      // AllBookingDates = [...new Set(AllBookingDates)];
      // console.log(AllBookingDates, 'after booking');
      // CardContainer = document.getElementById("bookingCardContainer");
      // CardContainer.innerHTML = "";
      // let dateTabContainer = document.getElementById("dateTabContainer");
      // dateTabContainer.innerHTML = ""; // Clear existing tabs
      // // Create date tabs
      // AllBookingDates.forEach(date => {
      //   let dateObj = new Date(date);
      //   if (!isNaN(dateObj)) {
      //     const options = { month: 'long', day: 'numeric' };
      //     let formattedDate = dateObj.toLocaleDateString(undefined, options);
      //     let tabOuter = document.createElement("div");
      //     tabOuter.className = "date-tab-outer";
      //     tabOuter.setAttribute("data-id", bk.ID);
      //     let tab = document.createElement("div");
      //     tab.className = "date-tab";
      //     tab.innerHTML = `<h4>${formattedDate}</h4><li>${bookings.filter(b => b.Booking_Date === date).length} Bookings | ${bookings.filter(b => b.Booking_Date === date).reduce((acc, b) => acc + (b.Job_Requests ? b.Job_Requests.length : 0), 0)} Job Requests</li>`;
      //     tab.onclick = () => {
      //       document.querySelectorAll(".date-tab").forEach(t => t.classList.remove("active"));
      //       tab.classList.add("active");
      //       // Filter bookings by selected date
      //       let filteredBookings = bookings.filter(b => b.Booking_Date === date);
      //       renderBookings(filteredBookings);
      //     };
      //     tabOuter.appendChild(tab);
      //     dateTabContainer.appendChild(tabOuter);
      //   }
      // });
    // CardContainer = document.getElementById("bookingCardContainer");
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

  // =======================
  // Fetch Booking Line Items
  // =======================
  function loadBookingDetails(customerId) {
    // console.log(customerId,"customerId");
    
    const config_LineItems = {
      appName: "fab-master-erp1",
      reportName: "All_Booking_Line_Items",
      criteria: `(Customer == ${customerId})`,
      page: 1,
      pageSize: 200,
    };  

    ZOHO.CREATOR.API.getAllRecords(config_LineItems).then(response => {
      let items = response.data || [];      

      renderBookingTable(items);
    });
  }
  function loadJobsDetails(customerId) {
    const config_Jobs = {
      appName: "fab-master-erp1",
      reportName: "All_Jobs",
      criteria: `(Booking_ID.Customer_Name == ${customerId})`,
      page: 1,
      pageSize: 200,
    };

    ZOHO.CREATOR.API.getAllRecords(config_Jobs).then(response => {
      let items = response.data || [];
        
      renderJobTable(items)
    });
  }


// ---------- helpers ----------
function getDayNumber(dayName) {
  const days = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
  };
  if (!dayName) return -1;
  return days[String(dayName).toLowerCase().trim()] ?? -1;
}

function parseDays(daysField) {
  // return array of day names like ['Monday','Tuesday']
  if (!daysField) return [];
  // if already an array (could be array of strings or array of objects)
  if (Array.isArray(daysField)) {
    return daysField.map(d => {
      if (typeof d === 'string') return d.trim();
      if (d && typeof d === 'object') return (d.display_value || d.name || d.value || '').toString().trim();
      return '';
    }).filter(Boolean);
  }
  // if it's a plain string like "Monday,Tuesday"
  if (typeof daysField === 'string') {
    return daysField.split(',').map(s => s.trim()).filter(Boolean);
  }
  // if object (Zoho sometimes returns {display_value: "Monday,Tuesday"} or other shapes)
  if (typeof daysField === 'object') {
    if (daysField.display_value && typeof daysField.display_value === 'string') {
      return daysField.display_value.split(',').map(s => s.trim()).filter(Boolean);
    }
    // fallback: collect object's values
    const vals = Object.values(daysField)
      .map(v => (typeof v === 'string' ? v : (v && v.display_value ? v.display_value : '')))
      .join(',')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    return vals;
  }
  return [];
}

function safeDateFromField(fieldValue) {
  // fieldValue might be "2025-10-04 15:55" or an object with display_value
  if (!fieldValue) return null;
  if (typeof fieldValue === 'string') {
    // take first token (date)
    return new Date(fieldValue.split(' ')[0]);
  }
  if (fieldValue instanceof Date) return fieldValue;
  if (typeof fieldValue === 'object' && fieldValue.display_value) {
    return new Date(String(fieldValue.display_value).split(' ')[0]);
  }
  return null;
}

function countDaysBetween(startDateStr, endDateStr, dayNamesArray) {
  const dayNames = Array.isArray(dayNamesArray) ? dayNamesArray : [];
  if (!dayNames.length) return 1;

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start) || isNaN(end) || start > end) return 1;

  let total = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const cur = d.getDay();
    if (dayNames.some(dn => getDayNumber(dn) === cur)) total++;
  }
  return total || 1;
}

function monthsBetweenInclusive(d1, d2) {
  // returns number of months inclusive; same month => 1
  let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  return months + 1;
}

function calculateLoopCount(freq, startDateStr, endDateStr, dayNamesArray) {
  const freqLower = (freq || '').toString().trim().toLowerCase();
  const start = safeDateFromField(startDateStr);
  const end = safeDateFromField(endDateStr);
  if (!start || !end || start > end) return 1;

  const inclusiveDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  switch (freqLower) {
    case 'once':
      return 1;

    case 'weekly':
      if (dayNamesArray && dayNamesArray.length) {
        return countDaysBetween(start, end, dayNamesArray);
      }
      return Math.max(1, Math.ceil(inclusiveDays / 7));

    case 'monthly':
      if (dayNamesArray && dayNamesArray.length) {
        return countDaysBetween(start, end, dayNamesArray);
      }
      return Math.max(1, monthsBetweenInclusive(start, end));

    case 'quarterly':
      return Math.max(1, Math.ceil(monthsBetweenInclusive(start, end) / 3));

    case 'half yearly':
    case 'half-yearly':
    case 'halfyearly':
      return Math.max(1, Math.ceil(monthsBetweenInclusive(start, end) / 6));

    case 'yearly':
    case 'annual':
    case 'annually':
      return Math.max(1, Math.ceil(monthsBetweenInclusive(start, end) / 12));

    default:
      // handle "2 years", "3 years" etc. (every N years)
      const m = freqLower.match(/(\d+)\s*year/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (!isNaN(n) && n > 0) {
          const yearsCovered = (end.getFullYear() - start.getFullYear()) + 1;
          return Math.max(1, Math.ceil(yearsCovered / n));
        }
      }
      // fallback
      return 1;
  }
}

// ---------- render function ----------
function renderBookingTable(items) {
  const container = document.getElementById("bookingTableContainer");
  container.innerHTML = "";

  // --- Create top action bar (initially hidden)
  const actionBar = document.createElement("div");
  actionBar.id = "tableActionBar";
  actionBar.style.display = "none";
  actionBar.style.marginBottom = "10px";
  actionBar.innerHTML = `
    <button id="editBtn" style="background:#007bff;color:#fff;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;margin-right:6px;">Edit</button>
    <button id="deleteBtn" style="background:#dc3545;color:#fff;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;">Delete</button>
  `;

  container.appendChild(actionBar);


  // --- Group by Service
  const serviceMap = {};
  (items || []).forEach(it => {
    const service = it.Service_Type1?.display_value || "No Service";
    if (!serviceMap[service]) serviceMap[service] = [];
    serviceMap[service].push(it);
  });

  let html = `
  <table style="width:100%; border-collapse: collapse; margin-bottom:15px;">
    <thead>
      <tr>
        <th>Select</th><th>Booking ID</th><th>BK Type</th><th>Property Name</th>
        <th>Property No</th><th>Frequency</th><th>Days</th><th>Start Date</th>
        <th>End Date</th><th>Preferred Time</th><th>Status</th><th style="text-align:center;">Action</th><th></th>
      </tr>
    </thead>
    <tbody>
  `;



  Object.keys(serviceMap).forEach(service => {
   
    html += `<tr><td colspan="13" style="background:#f5f5f5;padding:6px 10px;border-radius:6px;"><h3 style="margin:0">${service}</h3></td></tr>`;
    
    serviceMap[service].forEach(it => {
      const rawDays = it.Days;
      const dayNames = parseDays(rawDays);

      const rawStart = it["Preffered_Start_Time"] || it.Start_Date || it.start_date || it["Start_Date"];
      const rawEnd = it["Preffered_End_Time"] || it.End_Date || it.end_date || it["End_Date"];
      const startDateStr = (typeof rawStart === 'string') ? rawStart.split(' ')[0] : (rawStart?.display_value ? rawStart.display_value.split(' ')[0] : rawStart);
      const endDateStr = (typeof rawEnd === 'string') ? rawEnd.split(' ')[0] : (rawEnd?.display_value ? rawEnd.display_value.split(' ')[0] : rawEnd);

      const loopCount = calculateLoopCount(it.Frequency, startDateStr, endDateStr, dayNames);

        
    //   for (let i = 0; i < loopCount; i++) {
        html += `<tr id="${it.Parent_ID?.ID || ""}">
          <td><input type="checkbox" class="rowCheckbox" data-id="${it.Parent_ID?.ID || ""}" /></td>
          <td>${it.Parent_ID?.display_value || ""}</td>
          <td>${it.BHK_Type?.display_value || ""}</td>
          <td>${it.Property_Name?.Property_Name || it.Property_Name?.display_value || ""}</td>
          <td>${it["Property_Name.Property_Number"] || ""}</td>
          <td>${it.Frequency || ""}</td>
          <td>${Array.isArray(dayNames) ? dayNames.join(", ") : (it.Days || "")}</td>
          <td>${startDateStr || ""}</td>
          <td>${endDateStr || ""}</td>
          <td>${(it["Preffered_Start_Time"] ? it["Preffered_Start_Time"].split(" ")[1] : "")} - ${(it["Preffered_End_Time"] ? it["Preffered_End_Time"].split(" ")[1] : "")}</td>
          <td><span style="padding:4px 8px; background:#ffeeba; border-radius:4px; display:block; text-align:center;">${it["Parent_ID.Status"] || ""}</span></td>
          <td><button class="action-btn">Create</button></td>
          <td><div class="Row-btn-item" onclick="hideShow(event)">View</div></td>
        </tr>`;
    //   }
    });
  });

  html += "</tbody></table>";
  container.innerHTML += html;

  // --- Show/Hide top buttons when checkbox changes
  document.querySelectorAll(".rowCheckbox").forEach(chk => {
    chk.addEventListener("change", () => {
      const anyChecked = document.querySelectorAll(".rowCheckbox:checked").length > 0;
      document.getElementById("tableActionBar").style.display = anyChecked ? "block" : "none";
    });
  });

  // --- Example button actions (you can customize)
  document.getElementById("editBtn").onclick = () => {
    const ids = [...document.querySelectorAll(".rowCheckbox:checked")].map(c => c.dataset.id);
    alert("Edit clicked for IDs: " + ids.join(", "));
  };

  document.getElementById("deleteBtn").onclick = () => {
    const ids = [...document.querySelectorAll(".rowCheckbox:checked")].map(c => c.dataset.id);
    alert("Delete clicked for IDs: " + ids.join(", "));
  };
}

  // Search function for Job ID
  document.getElementById("searchJobInput").addEventListener("input", function () {
    let val = this.value.toLowerCase();

    let rows = document.querySelectorAll("#jobTable tbody tr");

    let currentGroup = null;
    let groupHasVisibleRow = false;

    rows.forEach(row => {
      let jobIdCell = row.cells[1]; // 2nd column = Job ID
      if (!jobIdCell) {
        // This is a date header row
        if (currentGroup && !groupHasVisibleRow) {
          currentGroup.style.display = "none"; // hide group if no matches
        }
        currentGroup = row;
        groupHasVisibleRow = false;
        row.style.display = ""; // always reset header, decide later
      } else {
        let jobId = jobIdCell.textContent.toLowerCase();
        if (jobId.includes(val)) {
          row.style.display = "";
          groupHasVisibleRow = true;
        } else {
          row.style.display = "none";
        }
      }
    });

    // Final group check
    if (currentGroup && !groupHasVisibleRow) {
      currentGroup.style.display = "none";
    }
  });


});

  function OpenJOBDetails(jobId) {
//   console.log(jobId);
  // let CName = document.getAttribute("customerName");
  // let jbID = document.getAttribute("data-id");
  document.querySelector("BookingSection").style.display = "none";
  document.querySelector(".JobOverviewInner").style.display = "block";
  resetFilters();

}
// Toggle dropdown
document.querySelectorAll(".more-btn").forEach(btn => {
//   console.log(btn, "asd");

  btn.addEventListener("click", function (even) {
    // console.log(even);

    let dropdown = this.nextElementSibling;
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });
});

// Redirect to another page
function goToView(RowID) {
//   console.log(RowID);
  
      // document.getElementById("BookignName").innerHTML = `${RowID}`;
  document.querySelector(".BookingInner").style.display = "none";
  document.querySelector(".jobinner").style.display = "block";
}
function backBooking() {
  document.querySelector(".BookingInner").style.display = "block";
  document.querySelector(".jobinner").style.display = "none";
  resetFilters();
}
// Close dropdown if clicked outside
document.addEventListener("click", function (event) {
  if (!event.target.closest(".action_Section")) {
    document.querySelectorAll(".dropdown-menu").forEach(menu => menu.style.display = "none");
  }
});
// ========================
// Filters & Popup Handling
// ========================
document.getElementById("searchInput").addEventListener("input", function () {
  let val = this.value.trim().toLowerCase();

  document.querySelectorAll("#bookingTableContainer tbody tr").forEach(row => {
    // Service header rows (colspan=13) should always be visible
    if (row.querySelector("td[colspan]")) {
      row.style.display = "";
      return;
    }

    // Data rows → check booking id (cell[1])
    let bkId = row.cells[1]?.textContent.toLowerCase() || "";
    row.style.display = bkId.includes(val) ? "" : "none";
  });

  // OPTIONAL: Hide service header if all its rows are hidden
  document.querySelectorAll("#bookingTableContainer tbody").forEach(tbody => {
    let rows = [...tbody.rows];
    rows.forEach((row, idx) => {
      if (row.querySelector("td[colspan]")) {
        // find next service section until next header
        let nextHeaderIndex = rows.slice(idx + 1).findIndex(r => r.querySelector("td[colspan]"));
        let sectionRows = nextHeaderIndex === -1 ? rows.slice(idx + 1) : rows.slice(idx + 1, idx + 1 + nextHeaderIndex);

        // if all rows hidden → hide header
        let allHidden = sectionRows.every(r => r.style.display === "none");
        row.style.display = allHidden ? "none" : "";
      }
    });
  });
});


// Status filter

function filterBookingStatus(status, event) {
  // Remove active class from all booking filter buttons
  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));

  // Highlight the clicked one
  event.target.classList.add("active");

  // Loop through booking table rows
  document.querySelectorAll("#bookingTableContainer tbody tr").forEach(row => {
    // Adjust column index if "Status" is not at cell[10]
    let rowStatus = row.cells[10]?.innerText.trim().toLowerCase();

    if (status === "all") {
      row.style.display = "";
    } else {
      row.style.display = (rowStatus === status) ? "" : "none";
    }
  });
}

function filterJobStatus(status, event) {
  // Remove active class from job filter buttons
  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));

  // Highlight the clicked one
  event.target.classList.add("active");

  // Loop through job table rows
  document.querySelectorAll("#jobTableContainer tbody tr").forEach(row => {
    let rowStatus = row.cells[9]?.innerText.trim().toLowerCase(); // change index to match Job status column
    // console.log(status, "rowStatus");


    if (status === "all") {
      row.style.display = "";
    } else {
      row.style.display = (rowStatus === status) ? "" : "none";
    }
  });
}


// Toggle Date Filter
document.getElementById("dateFilterBtn").addEventListener("click", function () {
  this.classList.toggle("active");
  let startInput = document.getElementById("startDate");
  let endInput = document.getElementById("endDate");

  if (this.classList.contains("active")) {
    startInput.classList.add("show-date");
    endInput.classList.add("show-date");
  } else {
    startInput.classList.remove("show-date");
    endInput.classList.remove("show-date");
    setTimeout(() => {
      startInput.style.display = "none";
      endInput.style.display = "none";
    }, 300);
  }
});

// Date filtering
document.getElementById("endDate").addEventListener("change", function () {
  let startInput = document.getElementById("startDate").value;
  let endInput = this.value;

  let start = startInput ? new Date(startInput) : null;
  let end = endInput ? new Date(endInput) : null;

  let rows = document.querySelectorAll("#bookingTableContainer tbody tr");
  rows.forEach(row => {
    // skip service header rows (they have colspan)
    if (row.cells.length < 9) return;

    let startDate = new Date(row.cells[7]?.innerText.trim());
    let endDate = new Date(row.cells[8]?.innerText.trim());

    // if dates are invalid, just skip filtering for that row
    if (isNaN(startDate) || isNaN(endDate)) return;

    // filtering logic
    if ((start && startDate < start) || (end && endDate > end)) {
      row.style.display = "none";
    } else {
      row.style.display = "";
    }
  });
});

// Reset filters
function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.querySelectorAll("#bookingTableContainer tbody tr").forEach(row => row.style.display = "");
}

// ========================
// Popup Add Booking
// ========================
// let modal = document.getElementById("bookingFormModal");
// let openBtn = document.getElementById("openFormBtn");
// let closeBtn = document.querySelector(".close");

// openBtn.onclick = () => modal.style.display = "block";
// closeBtn.onclick = () => modal.style.display = "none";
// window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };




// Old code here ----------->

// async function fetchBookings() {
//   await ZOHO.CREATOR.init();

//   const config_BK = {
//     appName: "fab-master-erp1",
//     reportName: "All_Bookings",
//     page: 1,
//     pageSize: 200,
//   };

//   const response = await ZOHO.CREATOR.API.getAllRecords(config_BK);
//   return response.data;
// }

// fetchBookings().then(bookings => {
//   AllBookings = bookings;
//   renderBookings(AllBookings);
// });

// // ---- Function to render bookings into table ----
// function renderBookings(bookings) {
//   let tableBody = document.querySelector("#bookingTable tbody");
//   CardContainer = document.getElementById("bookingCardContainer");
//   CardContainer.innerHTML = ""; // Clear existing cards
//   // clear old rows
//   tableBody.innerHTML = "";

//   bookings.forEach(booking => {
//     console.log(booking, 'booking-----------');

//     AllBookingDates.push(booking.Service_Date);

//     console.log(AllBookingDates, 'booking');
//     AllBookingDates = [...new Set(AllBookingDates)];
//     console.log(AllBookingDates, 'after booking');

//     let dateTabContainer = document.getElementById("dateTabContainer");
//     dateTabContainer.innerHTML = ""; // Clear existing tabs
//     let tr = document.createElement("tr");
//     // Create date tabs
//     AllBookingDates.forEach(date => {
//       let dateObj = new Date(date);
//       if (!isNaN(dateObj)) {
//         const options = { month: 'long', day: 'numeric' };
//         let formattedDate = dateObj.toLocaleDateString(undefined, options);
//         let tabOuter = document.createElement("div");
//         tabOuter.className = "date-tab-outer";
//         tabOuter.setAttribute("data-id", booking.ID);
//         let tab = document.createElement("div");
//         tab.className = "date-tab";
//         tab.innerHTML = `<h4>${formattedDate}</h4><li>${bookings.filter(b => b.Service_Date === date).length} Bookings | ${bookings.filter(b => b.Service_Date === date).reduce((acc, b) => acc + (b.Job_Requests ? b.Job_Requests.length : 0), 0)} Job Requests</li>`;
//         tab.onclick = () => {
//           document.querySelectorAll(".date-tab").forEach(t => t.classList.remove("active"));
//           tab.classList.add("active");
//           // Filter bookings by selected date
//           let filteredBookings = bookings.filter(b => b.Service_Date === date);
//           renderBookings(filteredBookings);
//         };
//         tabOuter.appendChild(tab);
//         dateTabContainer.appendChild(tabOuter);
//       }
//     });

//     // handle multi-value fields
//     let materials = Array.isArray(booking.Materials_Required)
//       ? booking.Materials_Required.map(m => m.display_value).join("<br>")
//       : (booking.Materials_Required || "");

//     let services = Array.isArray(booking.Service_Type)
//       ? booking.Service_Type.map(s => s.display_value).join("<br>")
//       : (booking.Service_Type || "");

//     // convert Service_Date → Day (Mon, Tue, …)
//     let serviceDate = booking.Service_Date || "";
//     let dayName = "";
//     if (serviceDate) {
//       let dateObj = new Date(serviceDate);
//       if (!isNaN(dateObj)) {
//         const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//         dayName = days[dateObj.getDay()];
//       }
//     }
//     let card = `
//       <div class="booking-card active" data-id="${booking.ID}">
//         <div class="booking-card-header">
//           <h4 title="${booking.Booking_ID} | ${booking.Customer_Name?.display_value}">
//             ${booking.Booking_ID} | ${booking.Customer_Name?.display_value}
//           </h4>
//           <span class="status status-status-${(booking.Status || "").toLowerCase()}">
//             ${booking.Status || ""}
//           </span>
//         </div> 

//         <ul class="bookingList-info">
//           <li title="${booking.Employee.display_value}">
//             <span class="material-symbols-outlined">person</span>${booking.Employee.display_value}
//           </li>
//           <li title="${booking.Location_Link.value}">
//             <span class="material-symbols-outlined">location_on</span>${booking.Location_Link.value || ""}
//           </li>
//           <li title="${booking.Customer_Name?.display_value}">
//             <span class="material-symbols-outlined">account_circle</span>${booking.Customer_Name?.display_value}
//           </li>
//         </ul>
//         <div class="job-requests">
//           <div><strong>Job Requests</strong></div>
//           <div class="job-requestInner"></div>
//         </div>
//       </div>`;

//     // insert card into DOM first
//     CardContainer.innerHTML += card;

//     // now get the job-requestInner inside this card
//     let newCard = CardContainer.querySelector(`.booking-card[data-id="${booking.ID}"]`);
//     let JobRec = newCard.querySelector(".job-requestInner");

//     // fetch services
//     Config_Services = {
//       appName: "fab-master-erp1",
//       reportName: "All_Booking_Line_Items",
//       criteria: `(Parent_ID == ${booking.ID})`,
//       page: 1,
//       pageSize: 200,
//     };
//     console.log(Config_Services, 'Config_Services');

//     ZOHO.CREATOR.API.getAllRecords(Config_Services).then(response => {
//       console.log("Services for booking", booking.ID, response);
//       AllJobs = response.data;
//       console.log("AllJobs:", AllJobs);
//       renderJobs(AllJobs); // populate the job table

//       if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
//         response.data.forEach(service => {
//           let serviceDiv = document.createElement("div");
//           serviceDiv.innerHTML = `
//         <span>
//          ${service.Service_Type?.display_value || ""} 
//          ${service.Start_Date || ""} - ${service.End_Date || ""} | 
//            &nbsp; | Crew A | Driver A
//         </span>`;
//           JobRec.appendChild(serviceDiv);
//         });
//       } else {
//         // no service data → show placeholder
//         let emptyDiv = document.createElement("div");
//         emptyDiv.innerHTML = `<span>No Job Request</span>`;
//         JobRec.appendChild(emptyDiv);
//       }
//     });

//     // set record ID in attribute
//     tr.setAttribute("data-id", booking.ID);
//     tr.setAttribute("onclick", `openJobDetails('${booking.ID}')`);

//     tr.innerHTML = `
//       <td><input type="checkbox"></td>
//       <td>${booking.Booking_ID || ""}</td>
//       <td>${booking.Booking_Type || ""}</td>
//       <td>${booking.Customer_Name?.display_value || ""}</td>
//       <td>${materials}</td> 
//       <td onclick='openJobDetails('${booking.ID}')'>${services}</td>
//       <td>${booking.Frequency || ""}</td>
//       <td>${dayName || ""}</td>
//       <td>${booking.Service_Date || ""}</td>
//       <td>${booking.End_Date || ""}</td>
//       <td>${booking.Location_Link.value || ""}</td>
//       <td><span class="priority priority-${(booking.Priority || "").toLowerCase()}">${booking.Priority}</span></td>
//       <td><span class="status status-${(booking.Status || "").toLowerCase()}">${booking.Status || ""}</span></td>
//       <td> 
//         <button style="border: 1px solid #964C9E;color: #964C9E;" class="action-btn">
//           <span style="font-size: 14px;" class="material-symbols-outlined">edit</span>
//           <span>Create</span>
//         </button>
//       </td>
//     `;

//     tableBody.appendChild(tr);

//   });



// }
// Reset Filters
// function resetFilters() {
//   document.getElementById("searchInput").value = "";
//   document.getElementById("startDate").value = "";
//   document.getElementById("endDate").value = "";
//   filterStatus("all");
//   JobStatus("all");
// }
// function openJobDetails(jobId) {
//   console.log(jobId, 'jobId');

//   document.querySelector(".BookingInner").style.display = "none";
//   document.querySelector(".jobinner").style.display = "block";
//   resetFilters();
//   // config_Job = {
//   //   appName: "fab-master-erp1",
//   //   reportName: "All_Jobs",
//   //   page: 1,
//   //   pageSize: 200,
//   // };
//   // ZOHO.CREATOR.API.getAllRecords(config_Job).then(response => {
//   //   AllJobs = response.data;
//   //   console.log("AllJobs:", AllJobs);
//   //   renderJobs(AllJobs);

//   // });
//   function renderJobs(jobs) {
//     document.getElementById("BookignName").innerHTML = `${jobs[0]?.Booking_ID?.display_value || ""} | ${jobs[0]?.Customer_Name?.display_value || ""} 
//     `;
//     document.getElementById("Job-Priority").innerHTML = `<span class="tag priority priority-${(jobs[0]?.Priority || "").toLowerCase()}">${jobs[0]?.Priority || ""}</span>`;
//     document.getElementById("JobStatusValue").innerHTML = `<span class="tag status status-${(jobs[0]?.Status || "").toLowerCase()}">${jobs[0]?.Status || ""}</span>`;
//     let jobTableBody = document.querySelector("#jobTable tbody");
//     jobTableBody.innerHTML = "";

//     jobs.forEach(job => {
//       console.log(job, 'job');

//       // Handle multi-values
//       let materials = Array.isArray(job.Materials_Required)
//         ? job.Materials_Required.map(m => m.display_value).join("<br>")
//         : (job.Materials_Required || "");

//       let services = Array.isArray(job.Service_Type)
//         ? job.Service_Type.map(s => s.display_value).join("<br>")
//         : (job.Service_Type || "");

//       // Fallbacks for nested/flattened fields
//       let bookingId = job.Booking_ID?.display_value || "";
//       let customerName = job["Booking_ID.Customer_Name"] || job.Customer_Name?.display_value || "";
//       let location = job["Booking_ID.Location_Link"] || job.Location || "";

//       // Dates & times
//       let startTime = job.Start_Time || "";
//       let endTime = job.End_Time || "";
//       let actualStart = job.Actual_Start_Time || "";
//       let actualEnd = job.Actual_End_Time || "";

//       let tr = document.createElement("tr");
//       tr.setAttribute("data-id", job.ID);
//       tr.setAttribute("onclick", `openJobDashboard('${job.ID}')`);

//       tr.innerHTML = `
//       <td><input type="checkbox"></td>
//       <td>${job.Job_ID || ""}</td>
//       <td>${startTime}</td>
//       <td>${customerName}</td>  
//       <td>${services}</td>
//       <td>${materials}</td>
//       <td>${location}</td>
//       <td>${endTime}</td>
//       <td>${job.Job_Type || ""}</td>
//       <td><span class="status status-${(job.Status || "").toLowerCase()}">${job.Status || ""}</span></td>
//       <td>
//         <button style="border: 1px solid #964C9E;color: #964C9E;" class="action-btn">
//           <span style="font-size: 14px;" class="material-symbols-outlined">edit</span>
//           <span>Edit</span>
//         </button>
//       </td>
//     `;

//       jobTableBody.appendChild(tr);
//     });
//   }


// }
// function openJobDashboard(jobId) {
//   console.log(jobId);
//   document.querySelector(".jobinner").style.display = "none";
//   document.querySelector(".JobOverviewInner").style.display = "block";
//   resetFilters();

// }
// function backBooking() {
//   document.querySelector(".BookingInner").style.display = "block";
//   document.querySelector(".jobinner").style.display = "none";
//   resetFilters();
// }

// Search Booking ID
// document.getElementById("searchInput").addEventListener("keyup", function () {
//   let filter = this.value.toUpperCase();
//   let rows = document.querySelectorAll("#bookingTable tbody tr");
//   rows.forEach(row => {
//     let bookingId = row.cells[1].textContent.toUpperCase();
//     row.style.display = bookingId.includes(filter) ? "" : "none";
//   });
// });

// // Status booking Filter
// function filterStatus(status) {
//   console.log(status);

//   let rows = document.querySelectorAll("#bookingTable tbody tr");
//   let buttons = document.querySelectorAll(".filters button");
//   buttons.forEach(btn => btn.classList.remove("active"));


//   document.querySelector(`.filters button:nth-child(${status === "all" ? 1 : status === "pending" ? 2 : status === "in-progress" ? 3 : 4})`).classList.add("active");

//   rows.forEach(row => {
//     // console.log(row);

//     let rowStatus = row.cells[12].innerText.toLowerCase();
//     if (status === "all" || rowStatus.includes(status)) {
//       row.style.display = "";
//     } else {
//       row.style.display = "none";
//     }
//   });
// }

// function JobStatus(job) {
//   let jobrows = document.querySelectorAll("#jobTable tbody tr");
//   let jbbuttons = document.querySelectorAll(".jobFilter button");

//   // Remove active from all buttons
//   jbbuttons.forEach(btn => btn.classList.remove("active"));

//   // Map job to correct button index
//   let indexMap = {
//     "all": 1,
//     "upcoming": 2,
//     "assigned": 3,
//     "in-progress": 4,
//     "completed": 5
//   };

//   // Add active to the correct button
//   document.querySelector(`.jobFilter button:nth-child(${indexMap[job]})`).classList.add("active");

//   // Filter rows
//   jobrows.forEach(row => {
//     let jobrowStatus = row.cells[9].innerText.toLowerCase();
//     if (job === "all" || jobrowStatus.includes(job)) {
//       row.style.display = "";
//     } else {
//       row.style.display = "none";
//     }
//   });
// }


// Toggle Date Filter
document.getElementById("dateFilterBtn").addEventListener("click", function () {
  this.classList.toggle("active");
  let startInput = document.getElementById("startDate");
  let endInput = document.getElementById("endDate");

  if (this.classList.contains("active")) {
    startInput.classList.add("show-date");
    endInput.classList.add("show-date");
  } else {
    startInput.classList.remove("show-date");
    endInput.classList.remove("show-date");
    setTimeout(() => {
      startInput.style.display = "none";
      endInput.style.display = "none";
    }, 300);
  }
});

// Date filtering
document.getElementById("endDate").addEventListener("change", function () {
  let start = new Date(document.getElementById("startDate").value);
  let end = new Date(this.value);

  let rows = document.querySelectorAll("#bookingTableContainer tbody tr");
  rows.forEach(row => {
    let startDate = new Date(row.cells[7].innerText);
    let endDate = new Date(row.cells[8].innerText);

    if ((start && startDate < start) || (end && endDate > end)) {
      row.style.display = "none";
    } else {
      row.style.display = "";
    }
  });
});





// // Modal form functionality
// var Booking_modal = document.getElementById("formModal");
// var Job_modal = document.getElementById("formModalJob");
// var D_Job_modal = document.getElementById("formModal_DJob");

// var Book_btn = document.getElementById("openFormBtn");
// var Job_btn = document.getElementById("openJobFormBtn");
// var D_Job_btn = document.getElementById("open_DJobFormBtn");

// var Bookspan = document.getElementById("closeForm");
// var Jobspan = document.getElementById("closeJobForm");
// var D_Jobspan = document.getElementById("closeDJobForm"); // ✅ FIXED ID

// // Open modals
// Book_btn.onclick = function () {
//   Booking_modal.style.display = "block";
// }
// Job_btn.onclick = function () {
//   Job_modal.style.display = "block";
// }
// D_Job_btn.onclick = function () {
//   D_Job_modal.style.display = "block";
// }

// // Close modals
// Bookspan.onclick = function () {
//   Booking_modal.style.display = "none";
// }
// Jobspan.onclick = function () {
//   Job_modal.style.display = "none";
// }
// D_Jobspan.onclick = function () {
//   D_Job_modal.style.display = "none";
// }

// // Close when clicking outside
// window.onclick = function (event) {
//   if (event.target === Booking_modal) {
//     Booking_modal.style.display = "none";
//   }
//   if (event.target === Job_modal) {
//     Job_modal.style.display = "none";
//   }
//   if (event.target === D_Job_modal) {
//     D_Job_modal.style.display = "none";
//   }
// }











