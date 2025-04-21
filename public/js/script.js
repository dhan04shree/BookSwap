// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    "use strict";
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener(
        "submit", 
      event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
  
        form.classList.add("was-validated");
      }, 
      false
      );
    });
  })();


  let rowCount = 1;

  function addRow() {
    const tableBody = document.getElementById('bookTableBody');
    const addBtnRow = tableBody.lastElementChild;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" name="bookswap[${rowCount}][description]" class="form-control" required></td>
      <td><input type="number" min="1" name="bookswap[${rowCount}][originalP]" class="form-control" required></td>
      <td><input type="number" min="1" name="bookswap[${rowCount}][decidedP]" class="form-control" required></td>
      <td><input type="file" name="bookswap[${rowCount}][image]" accept="image/*" class="form-control" required></td>
      <td><button type="button" class="btn btn-danger" onclick="removeRow(this)">−</button></td>
    `;

    // Insert the new row above the "Add Book" row
    tableBody.insertBefore(row, addBtnRow);
    rowCount++;
  }

  function removeRow(button) {
    const row = button.closest('tr');
    const tableBody = document.getElementById('bookTableBody');
    // Prevent removing if it's the only input row
    if (tableBody.querySelectorAll('tr').length > 2) {
      row.remove();
    }
  }

