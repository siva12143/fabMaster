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
    newRow.innerHTML = `
        <td id="rowId${materilCount}">
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

// Job Material table add row End

const updateValue = () => {
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
    const ScheduledDate = document.getElementById("ScheduledDate");
    const StartTime = document.getElementById("Start_Time");
    const EndTime = document.getElementById("End_Time");
    const Crew = document.getElementById("Crew");
    const Driver = document.getElementById("Driver");
    const PickupLocation = document.getElementById("Pickup_Location");
    const DropoffLocation = document.getElementById("Dropoff_Location");
    const SpecialInstruction = document.getElementById("Special_Instruction");
    console.log(Crew);
    
    const formData = {
        data : {
            Job_Id1 : ReqId.getAttribute('data'),
            Service1: Service.getAttribute('data'),
            Crew1: Crew.getAttribute("value"),
            Scheduled_Start_Time1: "",
            Special_Instructions: "",
            Scheduled_End_Time:"",
            Driver1:Driver.getAttribute("value"),
            Customer:Customer.getAttribute('data')
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
        }else{
            console.log(response);
            
        }
    });


    // const newFormData = {
    //     data : {
    //         Job : 
    //         Materials : 
    //         Qty : 
    //     }
    // }
    // var config = {
    //     appName: "fab-master-erp1",
    //     formName: "Materials_Required_Job",
    //     data: formData
    // }
    // ZOHO.CREATOR.API.addRecord(config).then(function (response) {
    //     if (response.code == 3000) {
    //         console.log("Record added successfully");
    //     }else{
    //         console.log(response);
            
    //     }
    // });
}