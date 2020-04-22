(function (Vue) {
	//local storage key
	const STORAGE_KEY = 'items-todos';
	const itemStorage = {
		fetchItems: function(){
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		},
		saveItems: function(items){
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); 
		}
	};
	//customized directive for autofocus for input
	Vue.directive('app-focus', {
		inserted: function (el, binding) {
			el.focus();
		},
		update: function (el, binding) {
			if (binding.value) {
				el.focus();
			}

		}
	});

	var vm = new Vue({
		el: "#todoapp",
		data: {
			msg: 'My Todos',
			items: itemStorage.fetchItems(),
			currentItem: null,
			filterStatus: 'all'
		},
		watch: {
			//deep listen for attr's value  changes in obj
			items: {
				deep: true,
				handler: function(newItems, oldItems){
					itemStorage.saveItems(newItems);
				}
			}
		},
		computed: {
			//caculating how many tasks are still uncompleted
			remaining: function () {
				const unItems = this.items.filter(function (item) {
					return !item.completed;
				});
				return unItems.length;
			},
			//all select checkbox
			toggleAll: {
				get: function () {
					return this.remaining == 0;
				},
				set: function (newValue) {
					this.items.forEach(function (item) {
						item.completed = newValue;
					});
				}
			},
			//control router for all,active,completed
			filterItems: function () {
				switch (this.filterStatus) {
					case 'active':
						return this.items.filter(function (item) {
							return !item.completed;
						});
						break;
					case 'completed':
						return this.items.filter(function (item) {
							return item.completed;
						});
						break;
					default:
						return this.items;
						break;
				}
			}
		},
		methods: {
			//add task to list from input
			addItem: function (e) {
				const content = e.target.value.trim();
				if (!content.length) {
					return;
				}
				const id = this.items.length + 1;
				this.items.push({
					id: id,
					content: content,
					completed: false
				});
				e.target.value = '';
			},
			//delete task from list
			removeItem: function (index) {
				this.items.splice(index, 1);
			},
			//remove completed tasks from list
			removeCompleted: function () {
				this.items = this.items.filter(function (item) {
					return !item.completed;
				});
			},
			//show editing class 
			editItem: function (item) {
				this.currentItem = item;
			},
			//remove editing class
			cancelEdit: function () {
				this.currentItem = null;
			},
			//upadte 
			finishEdit: function (item, index, event) {
				const content = event.target.value.trim();
				if (!content) {
					this.removeItem(index);
					return;
				}
				item.content = content;
				this.currentItem = null;
			}
		}
	});

	//listen for hash value changes
	window.onhashchange = function () {
		const hash = window.location.hash.substr(2) || 'all';
		//define a comoputed attr filterItems to filter data on hash changes
		vm.filterStatus = hash;
	}
	//make sure when refreshing, list displays correct data
	window.onhashchange();
})(Vue);
