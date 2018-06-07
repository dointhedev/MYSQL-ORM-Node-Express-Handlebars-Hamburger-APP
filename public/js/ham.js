// The code in add.js handles what happens when the user clicks the "Add a book" button.
$(document).ready(function () {
  console.log("ready!");
  $(document).on("click", ".add-burger", addBurger);
  $(document).on("submit", ".create-burger", createBurger);
  $(document).on("click", ".delete-burger", deleteBurger);
  $(document).on("click", ".change-devoured", editDevo);
 // $(document).on("click", "button.delete", deleteTodo);
  $(document).on("click", "button.complete", toggleComplete);
  $(document).on("click", ".todo-item", editTodo);
  $(document).on("keyup", ".todo-item", finishEdit);
  $(document).on("blur", ".todo-item", cancelEdit);
 // $(document).on("submit", "#todo-form", insertTodo);


function addBurger(){
  event.preventDefault();
  console.log('inclick');
  $("#results-modal").modal("toggle");
}


function createBurger(){
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    let bur = $("#bur").val().trim();
    let rad = $("input[name='devoured']:checked").val();

    function validateForm() {
      let isValid = false;
      if ((bur !== "") && (rad <= 1)) {
        isValid = true
      }
      return isValid;
    }

    if (validateForm()) {
      //  if ((bur !== null) && (rad !== null)) {
      let newBurger = {
        name: bur,
        devoured: rad
      };
      // Send the POST request.
      $.ajax("/api/burgers", {
        type: "POST",
        data: newBurger
      }).then(
        function () {
          console.log("created new burger");
          $("#success").removeClass('hide d-none').addClass('show');
          // Reload the page to get the updated list
          setTimeout(() => {
            location.reload();
          }, 4000);
        }
      );
    } else {
      $("#problem").removeClass('hide d-none').addClass('show');
      setTimeout(() => {
        $("#problem").removeClass('show').addClass('hide d-none');
      }, 3000);
    }
  }

function deleteBurger(){
    var id = $(this).data("id");
    // Send the DELETE request.
    $.ajax("/api/burgers/" + id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted burger", id);
        // Reload the page to get the updated list
        $("#delete").removeClass('hide d-none').addClass('show');
        // Reload the page to get the updated list
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    );
  }

  function editDevo() {
    var id = $(this).data("id");
    var newDevoured = $(this).data("newdevoured");

    var newDevouredState = {
      devoured: newDevoured
    };

    // Send the PUT request.
    $.ajax("/api/burgers/" + id, {
      type: "PUT",
      data: newDevouredState
    }).then(
      function() {
        console.log("changed devoured to", newDevoured);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  }
    // This function handles showing the input box for a user to edit a todo
    function editTodo() {
      var currentTodo = $(this).data("todo");
      alert(currentTodo);
      $(this).children().hide();
      $(this).children("input.edit").val(currentTodo.text);
      $(this).children("input.edit").show();
      $(this).children("input.edit").focus();
    }
  
    // Toggles complete status
    function toggleComplete(event) {
      event.stopPropagation();
      var todo = $(this).parent().data("todo");
      todo.complete = !todo.complete;
      updateTodo(todo);
    }
  
    // This function starts updating a todo in the database if a user hits the "Enter Key"
    // While in edit mode
    function finishEdit(event) {
      var updatedTodo = $(this).data("todo");
      if (event.which === 13) {
        updatedTodo.text = $(this).children("input").val().trim();
        $(this).blur();
        updateTodo(updatedTodo);
      }
    }
  
    // This function updates a todo in our database
    function updateTodo(todo) {
      $.ajax({
        method: "PUT",
        url: "/api/todos",
        data: todo
      }).then(getTodos);
    }
  
    // This function is called whenever a todo item is in edit mode and loses focus
    // This cancels any edits being made
    function cancelEdit() {
      var currentTodo = $(this).data("todo");
      if (currentTodo) {
        $(this).children().hide();
        $(this).children("input.edit").val(currentTodo.text);
        $(this).children("span").show();
        $(this).children("button").show();
      }
    }
  
});