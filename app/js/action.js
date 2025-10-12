// Job Material table add row Start

const tableBody = document.querySelector("#productTable tbody");
const addRowBtn = document.getElementById("addRowBtn");

addRowBtn.addEventListener("click", () => {
    const newRow = document.createElement("tr");
    newRow.className = "bg-white border-b border-gray-200 hover:bg-gray-50";

    newRow.innerHTML = `
        <select name="" id="" class="w-[95%] px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                                    <option value="">Select</option>
                                                                    <option value="Select 1">Select 1</option>
                                                                    <option value="Select 2">Select 2</option>
                                                                    <option value="Select 3">Select 3</option>
                                                                </select>
                                                            </td>
                                                            <td><input class="px-3 py-2 font-medium text-gray-900 whitespace-nowrap" type="number" name="" id=""></td>
      `;

    tableBody.appendChild(newRow);
});

// Job Material table add row End