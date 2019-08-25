// Storage Controller
const StorageCtrl = (function(){
  // Public Methods
  return {
    storeItem: function(item){
      let items = [];
      // Check if any items in local storage
      if(localStorage.getItem('items') === null){
        console.log('null');
        items = [];
        // Push new item
        items.push(item);
        // Set to local storage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = localStorage.getItem('items');
        items = JSON.parse(items);

        //Push the new item
        items.push(item);
        console.log(items);

        //Reset Local storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      }
      else{
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item,index) => {
        if(item.id === updatedItem.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item,index) => {
        if(item.id === id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearAllStorage: function(){
      let items = [];
      localStorage.removeItem('items');
    }
  }
})();


// Item Controller
const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(itemName, itemCalories){
      let ID;
      // Create ID
      if(data.items.length >0){
        ID = data.items[data.items.length-1].id + 1;
      } else{
        ID =0;
      }

      // Calories to number
      itemCalories = parseInt(itemCalories);
      
      // Create new item
      newItem = new Item(ID, itemName, itemCalories)
      
      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: function(){
      let total = 0;
      data.items.forEach(item =>{
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    getItemById: function(id){
      let found = null;
      //Loop through items
      data.items.forEach(item =>{
        if(item.id === id){
          found = item;
        }
      });

      return found;
    },
    setCurrentItem: function(item){
      data.currentItem = item; 
    },
    updateItem: function(name, calories){
      // Calories to number
      calories = parseInt(calories);
      let found = null;
      
      data.items.forEach(item => {

        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item
        }
      })
      return found;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    deleteItem: function(id){
      data.items = data.items.filter(item => {
        return item.id !== id;
      });
    },
    clearAllItems: function(){
      data.items = [];
    }

    
  }
})();



// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    listItems: '#item-list li',
    clearBtn: '.clear-btn'

  }

  
  // Public methods
  return{
    populateItemList: function(items){
      let html = '';
      
      items.forEach(item => {
        
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`
      }); 
      
      // Insert List itens
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    getSelectors: function(){
      return UISelectors;
    },
    addListItem: function(item){
      UICtrl.showList();
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(updatedItem){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${updatedItem.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${updatedItem.name}: </strong> <em>${updatedItem.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      })
    },
    deleteItemList: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value='';
      document.querySelector(UISelectors.itemCaloriesInput).value='';
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'block';
    },
    addTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).innerHTML = `${totalCalories}`;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value= ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value= ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);

      listItems.forEach(item => {
        item.remove();
      })
    }

  }
})();



// App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl){
  // Load event listeners

  const loadEventListeners = function(){
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    })

    // Add edit event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Add edit event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Add Back button
    document.querySelector(UISelectors.backBtn).addEventListener('click', backButtonPressed);

    //Delete Item
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //Delete Item
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsSubmit);
  }
  // Clear items
  const clearAllItemsSubmit = function(e){
    e.preventDefault()

    //Delete all items from data structure
    ItemCtrl.clearAllItems();

    //Delete all items from ui
    UICtrl.removeItems();

     // Get total calories
     const totalCalories = ItemCtrl.getTotalCalories()
     UICtrl.addTotalCalories(totalCalories);

     //clear all items
     StorageCtrl.clearAllStorage();

     UICtrl.hideList();
 
  }
  // Delete Item
  const itemDeleteSubmit = function(e){
    e.preventDefault();

    //Get current item
    const currentItem = ItemCtrl.getCurrentItem();
    
    //Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    UICtrl.deleteItemList(currentItem.id);
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories()
    UICtrl.addTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();
  }

  // Clear edit state on back button press
  const backButtonPressed = function(e){
    e.preventDefault();
    UICtrl.clearEditState();
  }

  // Add item submit
  const itemAddSubmit = function(e){
    e.preventDefault();
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
    // Check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories()
      UICtrl.addTotalCalories(totalCalories);

      // Store items in the local storage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }
  }

  // Update item submit
  const itemEditClick = function(e){
    e.preventDefault();
    if(e.target.classList.contains('edit-item')){
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;
      

      // Break into an array
      const listIdArr = listId.split('-');

      // Get the actual ID
      const id = parseInt(listIdArr[1]);
      
      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }
  }

  const itemUpdateSubmit = function(e){
    e.preventDefault();

    //Get item input
    const input = UICtrl.getItemInput();

    //Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories()
    UICtrl.addTotalCalories(totalCalories);

    // Update Local storage
    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.clearEditState();
    
  }
  // Public methods
  return{
    init: function(){
      // Clear edit state / set initial state
      UICtrl.clearEditState();
      // Fetch items from data structure
      const items = ItemCtrl.getItems();
      
      // Check if any items
      if(items.length === 0){
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
        
      }

      // Populate list with items
      UICtrl.populateItemList(items);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories()
      UICtrl.addTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);

// Inialize App
App.init();